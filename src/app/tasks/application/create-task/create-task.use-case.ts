import { Inject, Injectable, Logger } from '@nestjs/common';
import { Task, TaskPriority } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/domain/repositories/task-repository.interface';
import { randomUUID } from 'crypto';
import { Result } from '@shared/core/Result';
import { InternalError, ValidationError } from '@shared/core/DomainError';

export type CreateTaskInput = {
    name        : string;
    description : string;
    priority    : TaskPriority;
    userId      : string;
};

export type CreateTaskOutput = {
    id          : string;
    name        : string;
    description : string;
    priority    : TaskPriority;
    status      : boolean;
    createdAt   : Date;
};

@Injectable()
export class CreateTaskUseCase {
    private readonly logger = new Logger(CreateTaskUseCase.name);

    constructor(
        @Inject('TaskRepository') private readonly taskRepository: TaskRepository
    ) {}

    async execute(input: CreateTaskInput): Promise<Result<CreateTaskOutput, ValidationError | InternalError>> {
        try {
            // 1. Create domain entity (validations happen here)
            const task = Task.create({
                id          : randomUUID(),
                name        : input.name,
                description : input.description,
                priority    : input.priority,
                status      : false,
                createAt    : new Date(),
                userId      : input.userId,
            });

            // 2. Save task to repository
            const createdTask = await this.taskRepository.create(task);

            return Result.ok(this.toTaskOutput(createdTask));
        } catch (error) {
            this.logger.error(`CreateTaskUseCase Error: ${error.message}`, error.stack);

            if (error instanceof ValidationError) {
                return Result.fail(error);
            }

            return Result.fail(InternalError.unexpected(error as Error));
        }
    }

    private toTaskOutput(task: Task): CreateTaskOutput {
        return {
            id          : task.getId(),
            name        : task.getName(),
            description : task.getDescription(),
            priority    : task.getPriority(),
            status      : task.getStatus(),
            createdAt   : task.getCreateAt(),
        };
    }
}
