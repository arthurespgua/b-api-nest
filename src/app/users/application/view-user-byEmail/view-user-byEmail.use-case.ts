import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@users/domain/entities/user.entity";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";

export type ViewUserByEmailInput = {
    email: string;
};

export type ViewUserByEmailOutput = {
    id          : string;
    name        : string;
    email       : string;
    isValidated : boolean;
    createdAt   : Date;
};

@Injectable()
export class ViewUserByEmailUseCase {
    constructor(@Inject('UserRepository') private readonly userRepository : UserRepository) {}

    async execute(input: ViewUserByEmailInput): Promise<ViewUserByEmailOutput> {
        try {
            // 1. Find user by Email
            const user = await this.userRepository.findByEmail(input.email);
            if (!user) throw new NotFoundException(`User with Email ${input.email} not found`);

            // 2. Convert domain entity to output format
            return this.toUserOutput(user);
        } catch (error) {
            throw error;
        }
    }

    private toUserOutput(user: User): ViewUserByEmailOutput {
        return {
            id          : user.getId(),
            name        : user.getName(),
            email       : user.getEmail(),
            isValidated : user.getIsValidated(),
            createdAt   : user.getCreateAt(),
        }
    }
}