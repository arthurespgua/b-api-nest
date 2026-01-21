import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";
import { User } from "@users/domain/entities/user.entity";


@Injectable()
export class UserRepositoryPrisma implements UserRepository {
    private readonly logger = new Logger(UserRepositoryPrisma.name);

    constructor(private readonly prisma: PrismaService) {}

    // Basic CRUD operations
    async create(user: User) : Promise<User>  {
        try {
            const created = await this.prisma.users.create({
                data: {
                    id           : user.getId(),
                    name         : user.getName(),
                    email        : user.getEmail(),
                    password     : user.getPassword(),
                    is_validated : user.getIsValidated(),
                    create_at    : user.getCreateAt(),
                },
            });

            this.logger.log(`User created successfully with id: ${created.id}`);
            return this.toDomain(created);;
        } catch (error) {
            this.logger.error('Error to create user:', error);
            throw new InternalServerErrorException(`Can't create user - Code: `, error.code);
        }
    }

    async findById(id: string) : Promise<User | null> {
        try {
            const userFind = await this.prisma.users.findUnique({
                where   : { id },
                include : {

                },
            });

            return userFind ? this.toDomain(userFind) : null;
        } catch (error) {
            this.logger.error('Error to find user:', error);
            throw new InternalServerErrorException(`Can't find user by id - Code: `, error.code);
        }
    }

    async findAll() : Promise<User[]> {
        try {
            const users = await this.prisma.users.findMany({
                include: {

                },
            });
            
            return users.map(user => this.toDomain(user));
        } catch (error) {
            this.handleRepositoryError(`Can't find all users - Code: `, error);
        }
    }

    async update(user: User) : Promise<User> {
        try {
            const updated = await this.prisma.users.update({
                where : { id: user.getId() },
                data  : {
                    name         : user.getName(),
                    email        : user.getEmail(),
                    password     : user.getPassword(),
                    is_validated : user.getIsValidated(),
                },
                include: {

                },
            });

            this.logger.log(`User updated successfully with id: ${updated.id}`);
            return this.toDomain(updated);
        } catch (error) {
            if (error.code === 'P2025') throw new NotFoundException(`User with id ${user.getId()} not found`);
            this.handleRepositoryError(`Can't update user with id ${user.getId()} - Code: `, error);
        }
    }

    async delete(id: string) : Promise<void> {
        try {
            await this.prisma.users.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') throw new NotFoundException(`User with id ${id} not found`);
            this.handleRepositoryError(`Can't delete user with id ${id} - Code: `, error);
        }
    }

    // Specific bussiness-rules operations
    async existsByEmail(email: string) : Promise<boolean> {
        try {
            const count = await this.prisma.users.count({
                where: { email },
            });
            return count > 0;
        } catch (error) {
            this.handleRepositoryError(`Error to check email existence - Error: `, error);
        }
    }

    async existsById(id: string) : Promise<boolean> {
        try {
            const count = await this.prisma.users.count({
                where: { id },
            });
            return count > 0;
        } catch (error) {
            this.handleRepositoryError(`Error to check user existence - Error: `, error);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.prisma.users.findUnique({
                where: { email },
                include: {

                },
            });

            return user ? this.toDomain(user) : null;
        } catch (error) {
            this.handleRepositoryError(`Error to find user by email - Error: `, error);
        }
    }

    async findByEmailAndPassword(email: string): Promise<User | null> {
        try {
            const userFind = await this.prisma.users.findUnique({
                where: { email },
                select: {
                    id           : true,
                    name         : true,
                    email        : true,
                    password     : true,
                    is_validated : true,
                    create_at    : true,
                },
            });

            return userFind ? this.toDomain(userFind) : null;
        } catch (error) {
            this.handleRepositoryError(`Error to find user by email and password - Error: `, error);
        }
    }

    // Methods specific to the business rules
    private toDomain(prismaUser: any): User {
        return new User({
            id          : prismaUser.id,
            name        : prismaUser.name,
            email       : prismaUser.email,
            password    : prismaUser.password,
            isValidated : prismaUser.is_validated,
            createAt    : prismaUser.create_at,
        });
    }

    private handleRepositoryError(error: any, context: string): never {
        this.logger.error(`Error trying to ${context}:`, error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') throw new ConflictException('Email already exists');
        throw new InternalServerErrorException(`Failed to ${context}`);
    }
}
