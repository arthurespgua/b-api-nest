import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@users/domain/entities/user.entity";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";

export type ViewUserInput = {
    id: string;
};

export type ViewUserOutput = {
    id           : string;
    name         : string;
    email        : string;
    isValidated  : boolean;
    createdAt    : Date;
};

@Injectable()
export class ViewUserUseCase {
    constructor(@Inject('UserRepository') private readonly userRepository : UserRepository) {}

    async execute(input: ViewUserInput): Promise<ViewUserOutput> {
        try {
            // 1. Find user by ID
            const user = await this.userRepository.findById(input.id);
            if (!user) throw new NotFoundException(`User with ID ${input.id} not found`);

            // 2. Convert domain entity to output format
            return this.toUserOutput(user);
        } catch (error) {
            throw error;
        }
    }

    private toUserOutput(user: User): ViewUserOutput {
        return {
            id          : user.getId(),
            name        : user.getName(),
            email       : user.getEmail(),
            isValidated : user.getIsValidated(),
            createdAt   : user.getCreateAt(),
        };
    }
}