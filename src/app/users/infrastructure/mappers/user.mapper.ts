import { Users } from "@prisma/client";
import { User } from "@users/domain/entities/user.entity";
import { CreateUserInput } from "@users/application/create-user/create-user.use-case";
import { ViewUserOutput } from "@users/application/view-user/view-user.use-case";
import { CreateUserDto } from "@users/presentation/dto/create-user.dto";

export class UserMapper {
    // De modelo Prisma a Entidad de Dominio
    static toDomain(prismaUser: Users): User {
        return new User({
            id           : prismaUser.id,
            name         : prismaUser.name,
            email        : prismaUser.email,
            password     : prismaUser.password,
            isValidated  : prismaUser.is_validated,
            createAt     : prismaUser.create_at,
        });
    }

    // De Entidad de Dominio a modelo Prisma (para crear/actualizar)
    static toPersistence(user: User): any {
        return {
            id           : user.getId(),
            name         : user.getName(),
            email        : user.getEmail(),
            password     : user.getPassword(),
            is_validated : user.getIsValidated(),
            create_at    : user.getCreateAt(),
        };
    }

    // De Entidad de Dominio a DTO (para responses API)
    static toResponseDto(user: User) : ViewUserOutput {
        return {
            id           : user.getId(),
            name         : user.getName(),
            email        : user.getEmail(),
            isValidated  : user.getIsValidated(),
            createdAt    : user.getCreateAt(),
        };
    }

    // De DTO a Objeto de Dominio (para commands)
    static fromDtoToCommand(dto: CreateUserDto): CreateUserInput {
        return {
            name          : dto.name,
            email         : dto.email,
            plainPassword : dto.password,
        };
    }
}