import { Inject, Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from '@tasks/domain/repositories/task-repository.interface';
import { Result } from '@shared/core/Result';
import { InternalError, NotFoundError, ForbiddenError } from '@shared/core/DomainError';

export type DeleteTaskInput = {
    id     : string;
    userId : string;
};

@Injectable()
export class DeleteTaskUseCase {
    private readonly logger = new Logger(DeleteTaskUseCase.name);

    constructor(
        @Inject('TaskRepository') private readonly taskRepository: TaskRepository
    ) {}

    async execute(input: DeleteTaskInput): Promise<Result<void, NotFoundError | ForbiddenError | InternalError>> {
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
                    ForbiddenError.insufficientPermissions('delete task that does not belong to you')
                );
            }

            // 3. Delete the task
            await this.taskRepository.delete(input.id);
            this.logger.log(`Task deleted successfully: ${input.id}`);

            return Result.ok(undefined);
        } catch (error) {
            this.logger.error(`DeleteTaskUseCase Error: ${error.message}`, error.stack);

            if (error instanceof ForbiddenError || error instanceof NotFoundError) {
                return Result.fail(error);
            }

            return Result.fail(InternalError.unexpected(error as Error));
        }
    }
}
