import { Inject, Injectable, Logger } from '@nestjs/common';
import { Task, TaskPriority } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/domain/repositories/task-repository.interface';
import { Result } from '@shared/core/Result';
import { InternalError, NotFoundError, ValidationError, ForbiddenError } from '@shared/core/DomainError';

export type UpdateTaskInput = {
    id          : string;
    name       ?: string;
    description?: string;
    priority   ?: TaskPriority;
    status     ?: boolean;
    userId      : string;
};

export type UpdateTaskOutput = {
    id          : string;
    name        : string;
    description : string;
    priority    : TaskPriority;
    status      : boolean;
    updatedAt   : Date;
};

@Injectable()
export class UpdateTaskUseCase {
    private readonly logger = new Logger(UpdateTaskUseCase.name);

    constructor(
        @Inject('TaskRepository') private readonly taskRepository: TaskRepository
    ) {}

    async execute(input: UpdateTaskInput): Promise<Result<UpdateTaskOutput, NotFoundError | ForbiddenError | ValidationError | InternalError>> {
        try {
            // 1. Verify task exists
            const existingTask = await this.taskRepository.findById(input.id);
            if (!existingTask) {
                return Result.fail(
                    NotFoundError.entity('Task', input.id)
                );
            }

            // 2. Verify ownership (authorization)
            if (existingTask.getUserId() !== input.userId) {
                return Result.fail(
                    ForbiddenError.insufficientPermissions('update task that does not belong to you')
                );
            }

            // 3. Create updated task with new values (immutable pattern)
            const updatedTask = Task.withUpdate({
                id          : existingTask.getId(),
                name        : input.name ?? existingTask.getName(),
                description : input.description ?? existingTask.getDescription(),
                priority    : input.priority ?? existingTask.getPriority(),
                status      : input.status ?? existingTask.getStatus(),
                createAt    : existingTask.getCreateAt(),
                updateAt    : new Date(),
                userId      : existingTask.getUserId(),
            });

            // 4. Save updated task
            const savedTask = await this.taskRepository.update(updatedTask);

            return Result.ok(this.toTaskOutput(savedTask));
        } catch (error) {
            this.logger.error(`UpdateTaskUseCase Error: ${error.message}`, error.stack);

            // If it's a domain validation error, propagate it
            if (error instanceof ValidationError || error instanceof ForbiddenError) {
                return Result.fail(error);
            }

            return Result.fail(InternalError.unexpected(error as Error));
        }
    }

    private toTaskOutput(task: Task): UpdateTaskOutput {
        return {
            id          : task.getId(),
            name        : task.getName(),
            description : task.getDescription(),
            priority    : task.getPriority(),
            status      : task.getStatus(),
            updatedAt   : task.getUpdateAt(),
        };
    }
}
