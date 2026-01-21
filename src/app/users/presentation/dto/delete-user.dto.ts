import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteUserDto {
    @ApiProperty({ example: '12345678901234567890123456', description: 'User ID to delete' })
    @IsString()
    @IsNotEmpty()
    id: string;
}