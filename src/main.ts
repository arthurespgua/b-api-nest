import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { SwaggerDocumentBuilder } from '@src/swagger/swagger-document-builder';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import 'winston-daily-rotate-file';
import * as express from 'express';

async function main() {
    const app = await NestFactory.create(AppModule , {
        logger: WinstonModule.createLogger({
            transports: [
                new transports.DailyRotateFile({
                    filename      : `logs/%DATE%-error.log`,
                    level         : 'error',
                    format        : format.combine(format.timestamp(), format.json()),
                    datePattern   : 'YYYY-MM-DD',
                    zippedArchive : false,
                    maxFiles      : '30d',
                }),
                new transports.DailyRotateFile({
                    filename      : `logs/%DATE%.log`,
                    format        : format.combine(format.timestamp(), format.json()),
                    datePattern   : 'YYYY-MM-DD',
                    zippedArchive : false,
                    maxFiles      : '30d',
                }),
                new transports.Console({
                    format: format.combine(
                        format.cli(),
                        format.splat(),
                        format.timestamp(),
                        format.printf((info) => {
                            return `${info.timestamp} ${info.level}: ${info.message}`;
                        }
                    ),
                ),
            }),
            ],
        }),
    });

    const swaggerDocumentBuilder = new SwaggerDocumentBuilder(app);
    swaggerDocumentBuilder.setupSwagger();

    const API_PREFIX  = 'api';
    const API_VERSION = 'v1';
    const API_PORT    = 3000;

    app.setGlobalPrefix(API_PREFIX);

    // API Versioning - URI Strategy (e.g., /api/v1/users)
    app.enableVersioning({
        type           : VersioningType.URI,
        defaultVersion : '1',
        prefix         : 'v',
    });

    // ==================== Security ====================
    // Helmet: HTTP security headers
    app.use(helmet({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
        crossOriginEmbedderPolicy: false,
        hsts: {
            maxAge            : 31536000,
            includeSubDomains : true,
            preload           : true,
        },
    }));

    // Rate Limiting Global: Prevenir abuso general
    const globalLimiter = rateLimit({
        windowMs : 15 * 60 * 1000,
        max      : 100,
        message  : {
            statusCode : 429,
            message    : 'Too many requests from this IP, please try again later',
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(globalLimiter);

    // Rate Limiting para Login: Prevenir brute force
    const loginLimiter = rateLimit({
        windowMs               : 15 * 60 * 1000,
        max                    : 5,
        skipSuccessfulRequests : true,
        message                : {
            statusCode : 429,
            message    : 'Too many login attempts from this IP, please try again later',
            code       : 'TOO_MANY_LOGIN_ATTEMPTS',
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(`/${API_PREFIX}/${API_VERSION}/users/auth/login`, loginLimiter);

    // CORS: Configure allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
    app.enableCors({
        origin      : allowedOrigins,
        methods     : 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials : true,
    });

    // ==================== Filters and Pipes ====================
    // Global Exception Filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global Validation Pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist            : true,
            forbidNonWhitelisted : true,
            transform            : true
        }),
    );

    // ==================== Static Assets ====================
    app.use('/wwwroot', express.static(join(__dirname, '..', 'wwwroot')));

    // ==================== Server Start ====================
    await app.listen(API_PORT);
    app.enableShutdownHooks();
    
    console.log(`\n🚀 Execute server at: http://localhost:${API_PORT}/${API_PREFIX}/${API_VERSION}`);
    console.log(`📚 Swagger Documentation: http://localhost:${API_PORT}/${API_PREFIX}/docs`);
    console.log(`🔒 Security: Helmet enabled`);
    console.log(`⏱️  Rate Limiting: Active`);
    console.log(`📌 API Version: ${API_VERSION}\n`);
}

main(); 
