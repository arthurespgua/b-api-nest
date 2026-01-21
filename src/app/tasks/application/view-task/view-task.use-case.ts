import { Inject, Injectable } from '@nestjs/common';
import { Task, TaskPriority } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/domain/repositories/task-repository.interface';

export type ViewTaskInput = {
    id     : string;
    userId : string; // From JWT token for authorization
};

export type ViewTaskOutput = {
    id          : string;
    name        : string;
    description : string;
    priority    : TaskPriority;
    status      : boolean;
    createdAt   : Date;
    updatedAt   : Date;
};

@Injectable()
export class ViewTaskUseCase {
    constructor(
        @Inject('TaskRepository') private readonly taskRepository: TaskRepository
    ) {}

    async execute(input: ViewTaskInput): Promise<ViewTaskOutput | null> {
        const task = await this.taskRepository.findById(input.id);
        
        // Authorization check: user can only view their own tasks
        if (task && task.getUserId() !== input.userId) {
            return null;
        }

        return task ? this.toTaskOutput(task) : null;
    }

    private toTaskOutput(task: Task): ViewTaskOutput {
        return {
            id          : task.getId(),
            name        : task.getName(),
            description : task.getDescription(),
            priority    : task.getPriority(),
            status      : task.getStatus(),
            createdAt   : task.getCreateAt(),
            updatedAt   : task.getUpdateAt(),
        };
    }
}
