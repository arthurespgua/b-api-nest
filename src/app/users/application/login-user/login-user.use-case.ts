import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '@users/domain/repositories/user-repository.interface';
import { SessionRepository } from '@users/domain/repositories/session-repository.interface';
import { PasswordService } from '@shared/services/password.services';
import { JwtService } from '@shared/services/jwt.service';
import { UnauthorizedError, InternalError } from '@shared/core/DomainError';
import { Result } from '@shared/core/Result';

export type LoginUserInput = {
    email    : string;
    password : string;
};

export type LoginUserOutput = {
    email : string;
    token : string;
};

@Injectable()
export class LoginUserUseCase {
    private readonly logger = new Logger(LoginUserUseCase.name);

    constructor(
        @Inject('UserRepository') private readonly userRepository       : UserRepository,
        @Inject('SessionRepository') private readonly sessionRepository : SessionRepository,
        private readonly jwtService : JwtService,
    ) {}

    async execute(input: LoginUserInput): Promise<Result<LoginUserOutput, UnauthorizedError | InternalError>> {
        try {
            // 1. Find user by email
            const user = await this.userRepository.findByEmailAndPassword(input.email);
            if (!user) {
                return Result.fail(
                    new UnauthorizedError('Correo electrónico no encontrado', {
                        code: 'USER_NOT_FOUND'
                    })
                );
            }

            // 2. Verify if user is active
            if (!user.getIsValidated()) {
                return Result.fail(
                    new UnauthorizedError('Usuario no validado por el administrador', {
                        code: 'USER_NOT_VALIDATED'
                    })
                );
            }

            // 3. Validate password
            const isPasswordValid = await PasswordService.comparePasswords(
                input.password, 
                user.getPassword()
            );

            if (!isPasswordValid) {
                return Result.fail(
                    new UnauthorizedError('Invalid password', {
                        code: 'INVALID_PASSWORD'
                    })
                );
            }

            // 4. Generate JWT token
            const token = this.jwtService.generateToken({
                id    : user.getId(),
                email : user.getEmail(),
                name  : user.getName(),
            });

            // 5. Invalidate all previous sessions for this user
            await this.sessionRepository.invalidateAllUserSessions(user.getId());
            this.logger.log(`Previous sessions invalidated for user: ${user.getId()}`);

            // 6. Create new session in database (for revocation support)
            await this.sessionRepository.createSession(user.getId(), token);

            // 7. Return user data and token
            return Result.ok({
                email : user.getEmail(),
                token,
            });
        } catch (error) {
            this.logger.error(`LoginUserUseCase Error: ${error.message}`, error.stack);
            return Result.fail(InternalError.unexpected(error as Error));
        }
    }
}