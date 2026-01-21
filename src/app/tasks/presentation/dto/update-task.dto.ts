import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { TaskPriority } from "@tasks/domain/entities/task.entity";

export class UpdateTaskDto {
    @ApiProperty({ 
        example     : 'Realizar café con leche',
        description : 'Task name (2-52 characters)',
        required    : false,
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(52)
    readonly name?: string;

    @ApiProperty({ 
        example     : 'Preparar café espresso con leche tibia...',
        description : 'Task description (2-256 characters)',
        required    : false,
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(256)
    readonly description?: string;

    @ApiProperty({ 
        example     : 'media',
        description : 'Task priority',
        enum        : TaskPriority,
        required    : false,
    })
    @IsOptional()
    @IsEnum(TaskPriority)
    readonly priority?: TaskPriority;

    @ApiProperty({ 
        example     : true,
        description : 'Task completion status',
        required    : false,
    })
    @IsOptional()
    @IsBoolean()
    readonly status ?: boolean;
}
