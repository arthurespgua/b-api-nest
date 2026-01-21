import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para debuggear el body raw de las requests
 * Útil para detectar problemas de parseo JSON
 */
@Injectable()
export class BodyLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(BodyLoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            this.logger.debug(`[${req.method}] ${req.path}`);
            this.logger.debug(`Headers: ${JSON.stringify(req.headers)}`);
            this.logger.debug(`Body: ${JSON.stringify(req.body, null, 2)}`);
        }
        next();
    }
}
