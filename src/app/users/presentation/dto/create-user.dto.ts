import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'Arturo', description: 'User firstname is setting by two or more words' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    readonly name: string;

    @ApiProperty({ example: 'arturo@example.com', description: 'User email' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'securePassword123', description: 'User password is setting by eight or more alphanumeric characters' })
    @IsString()
    @MinLength(8)
    readonly password: string;
}
