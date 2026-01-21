import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersController } from '@users/presentation/users.controller';
import { CreateUserUseCase } from '@users/application/create-user/create-user.use-case';
import { UpdateUserUseCase } from '@users/application/update-user/update-user.use-case';
import { DeleteUserUseCase } from '@users/application/delete-user/delete-user.use-case';
import { ViewUserUseCase } from '@users/application/view-user/view-user.use-case';
import { ViewUserByEmailUseCase } from '@users/application/view-user-byEmail/view-user-byEmail.use-case';
import { ViewUsersUseCase } from '@users/application/view-users/view-users.use-case';
import { LoginUserUseCase } from '@users/application/login-user/login-user.use-case';
import { ValidateJwtUseCase } from '@users/application/validate-jwt/validate-jwt.use-case';
import { UserRepositoryPrisma } from '@users/infrastructure/repositories/user-repository.prisma';
import { SessionRepositoryPrisma } from '@users/infrastructure/repositories/session-repository.prisma';
import { JwtService } from '@shared/services/jwt.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

@Module({
    imports     : [ 
        PrismaModule,
    ],
    controllers : [ UsersController ],
    providers   : [
        // Repositories
        UserRepositoryPrisma,
        {
            provide     : 'UserRepository',
            useExisting : UserRepositoryPrisma,
        },
        SessionRepositoryPrisma,
        {
            provide     : 'SessionRepository',
            useExisting : SessionRepositoryPrisma,
        },

        // Services
        JwtService,

        // Guards
        {
            provide  : APP_GUARD,
            useClass : JwtAuthGuard,
        },

        // Use Cases (Each service)
        CreateUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        ViewUserUseCase,
        ViewUsersUseCase,
        ViewUserByEmailUseCase,
        LoginUserUseCase,
        ValidateJwtUseCase,
    ],
    exports     : []
})

export class UsersModule {}
