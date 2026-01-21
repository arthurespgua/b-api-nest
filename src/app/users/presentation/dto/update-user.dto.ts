import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, MinLength, IsNumber, IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: 'María', description: 'Updated first name' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @ApiPropertyOptional({ example: 'López', description: 'Updated last name' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    lastname?: string;

    @ApiPropertyOptional({ example: 'García', description: 'Updated surname' })
    @IsOptional()
    @IsString()
    surname?: string;

    @ApiPropertyOptional({ example: 'maria.new@example.com', description: 'Updated email' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'newSecurePassword1234', description: 'Updated password' })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @ApiPropertyOptional({ example: 2, description: 'Updated department ID' })
    @IsOptional()
    @IsNumber()
    departmentId?: number;

    @ApiPropertyOptional({ example: 3, description: 'Updated role ID' })
    @IsOptional()
    @IsNumber()
    roleId?: number;

    @ApiPropertyOptional({ example: true, description: 'Set validation status' })
    @IsOptional()
    @IsBoolean()
    isValidated?: boolean;
}