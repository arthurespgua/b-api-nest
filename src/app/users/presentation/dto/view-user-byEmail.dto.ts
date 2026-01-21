import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ViewUserByEmailDto {
    @ApiProperty({ example: 'test@example.com', description: 'User email address' })
    @IsEmail()
    email : string;
}