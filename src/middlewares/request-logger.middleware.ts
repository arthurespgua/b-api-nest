import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RequestLoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => {
            const statusCode = res.statusCode;

            if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
                this.logger.warn(`[${req.method}] ${req.url} ${req.body} - ${statusCode}`);
            } 
            else if (statusCode) {
                this.logger.log(`[${req.method}] ${req.url} ${req.body} - ${statusCode}`);
            }
            else {
                this.logger.error(`[${req.method}] ${req.url} ${req.body} - No status code`);
            }
        });

        next();
    }
}