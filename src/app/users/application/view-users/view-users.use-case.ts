import { Inject, Injectable } from "@nestjs/common";
import { User } from "@users/domain/entities/user.entity";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";

export type ViewUsersOutput = {
    id          : string;
    name        : string;
    email       : string;
    isValidated : boolean;
    createdAt   : Date;
}[];

@Injectable()
export class ViewUsersUseCase {
    constructor(@Inject('UserRepository') private readonly userRepository : UserRepository) {}

    async execute(): Promise<ViewUsersOutput> {
        try {
            // 1. Fetch all users from the repository
            const users = await this.userRepository.findAll();

            // 2. Convert domain entities to output format
            return users.map(user => this.toUserOutput(user));

        } catch (error) {
            throw error;
        }
    }

    private toUserOutput(user: User): ViewUsersOutput[0] {
        return {
            id          : user.getId(),
            name        : user.getName(),
            email       : user.getEmail(),
            isValidated : user.getIsValidated(),
            createdAt   : user.getCreateAt(),
        };
    }
}