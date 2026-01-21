import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'arturo@example.com', description: 'User email' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: '@securePassword123#', description: 'User password is setting by eight or more alphanumeric characters' })
    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    readonly password: string;
}
