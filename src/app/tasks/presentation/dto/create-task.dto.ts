import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { TaskPriority } from "@tasks/domain/entities/task.entity";

export class CreateTaskDto {
    @ApiProperty({ 
        example     : 'Realizar café',
        description : 'Task name (2-52 characters)'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(52)
    readonly name: string;

    @ApiProperty({ 
        example     : 'Para preparar una taza de café fresca necesitamos...',
        description : 'Task description (2-256 characters)'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(256)
    readonly description: string;

    @ApiProperty({ 
        example     : 'alta',
        description : 'Task priority',
        enum        : TaskPriority,
    })
    @IsEnum(TaskPriority)
    @IsNotEmpty()
    readonly priority: TaskPriority;
}
