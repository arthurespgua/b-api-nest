import { CreateTaskInput } from "@tasks/application/create-task/create-task.use-case";
import { CreateTaskDto } from "@tasks/presentation/dto/create-task.dto";

export class TaskMapper {
    static fromDtoToCommand(dto: CreateTaskDto, userId: string): CreateTaskInput {
        return {
            name        : dto.name,
            description : dto.description,
            priority    : dto.priority,
            userId      : userId,
        };
    }
}
