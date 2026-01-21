import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@shared/services/jwt.service';
import { SessionRepository } from '@users/domain/repositories/session-repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(
        private readonly jwtService: JwtService,
        @Inject('SessionRepository') private readonly sessionRepository: SessionRepository,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const token   = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Authentication token not provided');
        }

        try {
            // 1. Verify token validity
            const payload = this.jwtService.verifyToken(token);

            // 2. Verify session validity
            const isSessionValid = await this.sessionRepository.isSessionValid(token);
            if (!isSessionValid) {
                throw new UnauthorizedException('Invalid or revoked session. Please log in again');
            }

            // 3. Add the payload to the request for use in the controller
            request['user'] = payload;

            return true;
        } catch (error) {
            this.logger.error(`JWT validation failed: ${error.message}`);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new UnauthorizedException('Token inválido o expirado');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader    = request.headers.authorization;
        const [type, token] = authHeader?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
