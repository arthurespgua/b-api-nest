import { Inject, Injectable } from '@nestjs/common';
import { Task, TaskPriority } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/domain/repositories/task-repository.interface';

export type ViewTasksByUserInput = {
    userId    : string;
    page     ?: number;
    limit    ?: number;
    priority ?: TaskPriority;
    status   ?: boolean;
};

export type TaskOutput = {
    id          : string;
    name        : string;
    description : string;
    priority    : TaskPriority;
    status      : boolean;
    createdAt   : Date;
    updatedAt   : Date;
};

export type ViewTasksByUserOutput = {
    tasks      : TaskOutput[];
    total      : number;
    page       : number;
    limit      : number;
    totalPages : number;
};

@Injectable()
export class ViewTasksByUserUseCase {
    constructor(
        @Inject('TaskRepository') private readonly taskRepository: TaskRepository
    ) {}

    async execute(input: ViewTasksByUserInput): Promise<ViewTasksByUserOutput> {
        const page  = input.page || 1;
        const limit = input.limit || 10;

        const result = await this.taskRepository.findByUserId(input.userId, {
            page,
            limit,
            priority : input.priority,
            status   : input.status,
        });

        const totalPages = Math.ceil(result.total / limit);

        return {
            tasks : result.tasks.map(task => this.toTaskOutput(task)),
            total : result.total,
            page,
            limit,
            totalPages,
        };
    }

    private toTaskOutput(task: Task): TaskOutput {
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
