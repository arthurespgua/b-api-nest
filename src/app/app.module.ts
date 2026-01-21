import { MiddlewareConsumer, Module, OnModuleInit, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from '@users/users.module';
import { RequestLoggerMiddleware } from '@middlewares/request-logger.middleware';
import { BodyLoggerMiddleware } from '@middlewares/body-logger.middleware';
import { PrismaService } from '@prisma/prisma.service';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { join } from 'path';
@Module({
    imports: [
        ConfigModule.forRoot(),
        UsersModule,
        ServeStaticModule.forRoot({
            rootPath  : join(__dirname, '../../..', 'wwwroot'),
            serveRoot : '/wwwroot',
        }),
        
    ],
    controllers: [ 
        AppController 
    ],
    providers: [ 
        AppService,
        PrismaService 
    ],
    exports: [ 
        PrismaService,
    ],
})

export class AppModule implements OnModuleInit {

    constructor(private appService: AppService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(RequestLoggerMiddleware, BodyLoggerMiddleware)
        .forRoutes(
            { path: '', method: RequestMethod.ALL },
            { path: '*path', method: RequestMethod.ALL }
        );
    }  

    onModuleInit() {}
}