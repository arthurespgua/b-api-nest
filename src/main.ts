import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { SwaggerDocumentBuilder } from '@src/swagger/swagger-document-builder';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
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

    const API_PREFIX = 'api';
    const API_PORT   = 3000;

    app.setGlobalPrefix(API_PREFIX);

    app.enableCors({
        origin      : ['http://localhost:5173'],
        methods     : 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials : true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist            : true,
            forbidNonWhitelisted : true,
            transform            : true
        }),
    );

    app.use('/wwwroot', express.static(join(__dirname, '..', 'wwwroot')));

    await app.listen(API_PORT);
    app.enableShutdownHooks();
}

main(); 
