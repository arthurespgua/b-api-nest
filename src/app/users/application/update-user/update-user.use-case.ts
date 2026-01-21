import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "@users/domain/entities/user.entity";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";
import { Result } from "@shared/core/Result";
import { NotFoundError, ConflictError, InternalError } from "@shared/core/DomainError";

export type UpdateUserInput = {
    id        : string;
    name     ?: string;
    email    ?: string;
    password ?: string;
}

export type UpdateUserOutput = {
    id        : string;
    name      : string;
    email     : string;
    updatedAt : Date;
}

@Injectable()
export class UpdateUserUseCase {
    private readonly logger = new Logger(UpdateUserUseCase.name);

    constructor(@Inject('UserRepository') private readonly userRepository : UserRepository){}

    async execute(input: UpdateUserInput): Promise<Result<UpdateUserOutput, NotFoundError | ConflictError | InternalError>> {
        try {
            // 1. Get existing user
            const existingUser = await this.userRepository.findById(input.id);
            if (!existingUser) {
                return Result.fail(
                    NotFoundError.entity('User', input.id)
                );
            }

            // 2. Validate if email is updated
            if (input.email && input.email !== existingUser.getEmail()) {
                const emailExists = await this.userRepository.existsByEmail(input.email);
                if (emailExists) {
                    return Result.fail(
                        ConflictError.alreadyExists('User', 'email', input.email)
                    );
                }
            }

            // 3. Apply updates (inmutable)
            const updatedUser = await existingUser.withUpdate({...input});

            // 4. Save updated user
            await this.userRepository.update(updatedUser);

            // 5. Return updated user
            return Result.ok(this.toUserOutput(updatedUser));
        } catch (error) {
            this.logger.error(`UpdateUserUseCase Error: ${error.message}`, error.stack);
            return Result.fail(InternalError.unexpected(error as Error));
        }
    }

    private toUserOutput(user: User): UpdateUserOutput {
        return {
            id        : user.getId(),
            name      : user.getName(),
            email     : user.getEmail(),
            updatedAt : new Date()
        };
    }
}
