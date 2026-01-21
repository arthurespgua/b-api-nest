import { Inject, Injectable, Logger } from '@nestjs/common';

import { Result } from '@shared/core/Result';
import { InternalError } from '@shared/core/DomainError';
import { SESSION_REPOSITORY, SessionRepository } from '@users/domain/repositories/session-repository.interface';

@Injectable()
export class LogoutUserUseCase {
    private readonly logger = new Logger(LogoutUserUseCase.name);

    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: SessionRepository,
    ) {}

    async execute(jwtToken: string): Promise<Result<void, InternalError>> {
        try {
            this.logger.log('Attempting to logout user');

            // Verify if the session exists before attempting to delete it
            const sessionExists = await this.sessionRepository.isSessionValid(jwtToken);

            if (!sessionExists) {
                this.logger.warn('Session not found or already expired');
                // Not an error, the session may have already expired
                return Result.ok(undefined);
            }

            // Invalidate the session (remove it from the DB)
            await this.sessionRepository.invalidateSession(jwtToken);

            this.logger.log('User logged out successfully');
            return Result.ok(undefined);

        } catch (error) {
            this.logger.error('Failed to logout user', error.stack);

            return Result.fail(
                InternalError.unexpected(error)
            );
        }
    }
}
