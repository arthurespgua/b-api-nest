import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteTaskDto {
    @ApiProperty({ example: '12345678901234567890123456789012', description: 'ID Task' })
    @IsString()
    @IsNotEmpty()
    id: string;
}