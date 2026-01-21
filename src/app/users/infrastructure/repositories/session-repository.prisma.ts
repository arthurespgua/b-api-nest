import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { SessionRepository } from '@users/domain/repositories/session-repository.interface';

@Injectable()
export class SessionRepositoryPrisma implements SessionRepository {
    private readonly logger = new Logger(SessionRepositoryPrisma.name);

    constructor(private readonly prisma: PrismaService) {}

    async createSession(userId: string, jwtToken: string): Promise<void> {
        try {
            await this.prisma.sessions.create({
                data: {
                    token   : jwtToken,
                    id_user : userId,
                },
            });

            this.logger.log(`Session created for user: ${userId}`);
        } catch (error) {
            this.logger.error(`Error creating session: ${error.message}`, error.stack);
            throw error;
        }
    }

    async invalidateSession(jwtToken: string): Promise<void> {
        try {
            await this.prisma.sessions.deleteMany({
                where: { token: jwtToken },
            });

            this.logger.log(`Session invalidated for token`);
        } catch (error) {
            this.logger.error(`Error invalidating session: ${error.message}`, error.stack);
            throw error;
        }
    }

    async invalidateAllUserSessions(userId: string): Promise<void> {
        try {
            const result = await this.prisma.sessions.deleteMany({
                where: { id_user: userId },
            });

            this.logger.log(`${result.count} sessions invalidated for user: ${userId}`);
        } catch (error) {
            this.logger.error(`Error invalidating user sessions: ${error.message}`, error.stack);
            throw error;
        }
    }

    async isSessionValid(jwtToken: string): Promise<boolean> {
        try {
            const session = await this.prisma.sessions.findFirst({
                where: { token: jwtToken },
            });

            return session !== null;
        } catch (error) {
            this.logger.error(`Error checking session validity: ${error.message}`, error.stack);
            return false;
        }
    }

    async cleanExpiredSessions(): Promise<number> {
        try {
            // Eliminar sesiones más antiguas de 24 horas
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() - 24);

            const result = await this.prisma.sessions.deleteMany({
                where: {
                    create_at: {
                        lt: expirationDate,
                    },
                },
            });

            this.logger.log(`Cleaned ${result.count} expired sessions`);
            return result.count;
        } catch (error) {
            this.logger.error(`Error cleaning expired sessions: ${error.message}`, error.stack);
            return 0;
        }
    }
}
