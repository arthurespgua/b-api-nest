import { Inject, Injectable } from '@nestjs/common';
import { Task, TaskPriority } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/domain/repositories/task-repository.interface';

export type TaskOutput = {
    id          : string;
    name        : string;
    description : string;
    priority    : TaskPriority;
    status      : boolean;
    userId      : string;
    createdAt   : Date;
    updatedAt   : Date;
};

export type ViewTasksOutput = {
    tasks : TaskOutput[];
    total : number;
};

@Injectable()
export class ViewTasksUseCase {
    constructor(
        @Inject('TaskRepository') private readonly taskRepository: TaskRepository
    ) {}

    async execute(): Promise<ViewTasksOutput> {
        const tasks = await this.taskRepository.findAll();

        return {
            tasks : tasks.map(task => this.toTaskOutput(task)),
            total : tasks.length,
        };
    }

    private toTaskOutput(task: Task): TaskOutput {
        return {
            id          : task.getId(),
            name        : task.getName(),
            description : task.getDescription(),
            priority    : task.getPriority(),
            status      : task.getStatus(),
            userId      : task.getUserId(),
            createdAt   : task.getCreateAt(),
            updatedAt   : task.getUpdateAt(),
        };
    }
}
