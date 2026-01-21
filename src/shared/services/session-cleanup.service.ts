import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SESSION_REPOSITORY } from '@app/users/domain/repositories/session-repository.interface';
import type { SessionRepository } from '@app/users/domain/repositories/session-repository.interface';

@Injectable()
export class SessionCleanupService {
    private readonly logger = new Logger(SessionCleanupService.name);

    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: SessionRepository,
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleSessionCleanup(): Promise<void> {
        this.logger.log('Starting automatic session cleanup');

        try {
            const deletedCount = await this.sessionRepository.cleanExpiredSessions();

            if (deletedCount > 0) {
                this.logger.log(`Successfully cleaned ${deletedCount} expired sessions`);
            } else {
                this.logger.debug('No expired sessions found');
            }
        } catch (error) {
            this.logger.error('Failed to clean expired sessions', error.stack);
        }
    }

    async cleanupNow(): Promise<number> {
        this.logger.log('Manual session cleanup triggered');
        return await this.sessionRepository.cleanExpiredSessions();
    }
}
