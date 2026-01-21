import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ValidateJWTDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxSlJaV1NDNDA5NDNUUzQ1WjBBTlg4VlpFIiwiZW1haWwiOiJqb3NlLm1hbnVlbEB4eWJvb3N0ZXIuY29tIiwibmFtZSI6Ikpvc2UgTWFudWVsIiwiaWF0IjoxNzQ0ODM4ODMwLCJleHAiOjE3NDQ4NDI0MzB9.m7Iny5QeOQbzruBtWAb9JANA6DTYB6HQy_KLGIJMmM0', description: 'JWT Token user' })
    @IsNotEmpty()
    @IsString()
    readonly token: string;
}
