import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserMapper } from '@users/infrastructure/mappers/user.mapper';
import { CreateUserUseCase } from '@users/application/create-user/create-user.use-case';
import { UpdateUserUseCase } from '@users/application/update-user/update-user.use-case';
import { DeleteUserUseCase } from '@users/application/delete-user/delete-user.use-case';
import { ViewUserUseCase } from '@users/application/view-user/view-user.use-case';
import { ViewUserByEmailUseCase } from '@users/application/view-user-byEmail/view-user-byEmail.use-case';
import { ViewUsersOutput, ViewUsersUseCase } from '@users/application/view-users/view-users.use-case';
import { LoginUserUseCase } from '@users/application/login-user/login-user.use-case';
import { ValidateJwtUseCase } from '@users/application/validate-jwt/validate-jwt.use-case';
import { CreateUserDto } from '@users/presentation/dto/create-user.dto';
import { UpdateUserDto } from '@users/presentation/dto/update-user.dto';
import { DeleteUserDto } from '@users/presentation/dto/delete-user.dto';
import { LoginUserDto } from '@users/presentation/dto/login-user.dto';
import { ViewUserByEmailDto } from '@users/presentation/dto/view-user-byEmail.dto';
import { Public } from '@shared/decorators/public.decorator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { ForbiddenError } from '@shared/core/DomainError';
import { JwtTokenData } from '@shared/services/jwt.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly createUser      : CreateUserUseCase,
        private readonly updateUser      : UpdateUserUseCase,
        private readonly deleteUser      : DeleteUserUseCase,
        private readonly viewUser        : ViewUserUseCase,
        private readonly viewUserByEmail : ViewUserByEmailUseCase,
        private readonly viewUsers       : ViewUsersUseCase,
        private readonly loginUser       : LoginUserUseCase,
        // private readonly validateUserWithToken : ValidateJwtUseCase,
    ) {}

    // Basic CRUD operations
    @Get()
    async findAll() : Promise<ViewUsersOutput> {
        return await this.viewUsers.execute();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentUser() user: JwtTokenData) {
        // Validate that the user can only view their own information
        if (id !== user.id) {
            throw ForbiddenError.insufficientPermissions('view other user information');
        }

        return await this.viewUser.execute({ id });
    }

    @Post()
    @Public()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto) {
        const createUserCommand = UserMapper.fromDtoToCommand(createUserDto);
        const result = await this.createUser.execute(createUserCommand);

        if (result.isFailure()) {
            const error = result.getError();
            throw error;
        }

        return {
            message : 'User created successfully',
            data    : result.getValue()
        };
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id')    id            : string,
        @Body()         updateUserDto : UpdateUserDto,
        @CurrentUser()  user          : JwtTokenData
    ) {
        // Validate that the user can only update their own information
        if (id !== user.id) {
            throw ForbiddenError.insufficientPermissions('update other user information');
        }

        const result = await this.updateUser.execute({ id, ...updateUserDto });

        if (result.isFailure()) {
            const error = result.getError();
            throw error;
        }

        return {
            message : 'User updated successfully',
            data    : result.getValue()
        };
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: JwtTokenData) {
        // Validate that the user can only delete their own account
        if (id !== user.id) {
            throw ForbiddenError.insufficientPermissions('delete other user account');
        }

        return this.deleteUser.execute(id);
    }

    // Bussiness-rules operations
    @Post('by-email')
    async findByEmail(@Body() userByEmailDto: ViewUserByEmailDto) {
        return await this.viewUserByEmail.execute(userByEmailDto);
    }

    @Post('auth/login')
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginUserDto: LoginUserDto) {
        const result = await this.loginUser.execute(loginUserDto);

        if (result.isFailure()) {
            const error = result.getError();
            throw error;
        }

        return {
            message : 'Login successful',
            data    : result.getValue()
        };
    }

    @Post('auth/validate')
    @HttpCode(HttpStatus.OK)
    async validateToken(@CurrentUser() user: JwtTokenData) {
        // If the guard passed, the token is valid
        return {
            message : 'Valid token',
            data    : {
                id        : user.id,
                email     : user.email,
                name      : user.name,
                issuedAt  : new Date(user.iat * 1000),
                expiresAt : new Date(user.exp * 1000),
            }
        };
    }
}
