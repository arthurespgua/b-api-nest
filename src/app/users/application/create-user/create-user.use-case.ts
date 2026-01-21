import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "@users/domain/entities/user.entity";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";
import { SessionRepository } from '@users/domain/repositories/session-repository.interface';
import { randomUUID } from 'crypto';
import { Result } from "@shared/core/Result";
import { ConflictError, InternalError } from "@shared/core/DomainError";
import { JwtService } from '@shared/services/jwt.service';

export type CreateUserInput = {
    name          : string;
    email         : string;
    plainPassword : string;
}

export type CreateUserOutput = {
    id        : string;
    name      : string;
    email     : string;
    createdAt : Date;
    token     : string;
};

@Injectable()
export class CreateUserUseCase {
    private readonly logger = new Logger(CreateUserUseCase.name);

    constructor (
        @Inject('UserRepository') private readonly userRepository       : UserRepository,
        @Inject('SessionRepository') private readonly sessionRepository : SessionRepository,
        private readonly jwtService : JwtService,
    ) {}

    async execute( input: CreateUserInput ) : Promise<Result<CreateUserOutput, ConflictError | InternalError>> {
        try {
            // 1. Check if user exists
            const userExists = await this.userRepository.existsByEmail(input.email);
            if (userExists) {
                return Result.fail(
                    ConflictError.alreadyExists('User', 'email', input.email)
                );
            }

            // 2. Create domain entity
            const user = await User.create({
                id          : randomUUID(),
                password    : input.plainPassword,
                createAt    : new Date(),
                isValidated : true, // Usuarios auto-validados al registrarse
                ...input,
            });

            // 3. Save user to repository
            const createdUser = await this.userRepository.create(user);

            // 4. Generate JWT token
            const token = this.jwtService.generateToken({
                id    : user.getId(),
                email : user.getEmail(),
                name  : user.getName(),
            });

            await this.sessionRepository.createSession(user.getId(), token);

            return Result.ok(this.toUserOutput(createdUser, token));
        } catch (error) {
            this.logger.error(`CreateUserUseCase Error: ${error.message}`, error.stack);

            // Si es un error de dominio (validación), lo propagamos
            if (error instanceof Error && error.message.includes('must be')) {
                return Result.fail(InternalError.unexpected(error));
            }

            return Result.fail(InternalError.unexpected(error as Error));
        }
    }

    private toUserOutput(user: User, token: string): CreateUserOutput {
        return {
            id        : user.getId(),
            name      : user.getName(),
            email     : user.getEmail(),
            createdAt : user.getCreateAt(),
            token     : token
        }
    }
}