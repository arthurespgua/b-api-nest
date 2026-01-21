import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { TaskRepository } from "@tasks/domain/repositories/task-repository.interface";
import { Task, TaskPriority } from "@tasks/domain/entities/task.entity";


@Injectable()
export class TaskRepositoryPrisma implements TaskRepository {
    private readonly logger = new Logger(TaskRepositoryPrisma.name);

    constructor(private readonly prisma: PrismaService) {}

    // Basic CRUD operations
    async create(task: Task): Promise<Task> {
        try {
            const created = await this.prisma.tasks.create({
                data: {
                    id          : task.getId(),
                    name        : task.getName(),
                    description : task.getDescription(),
                    priority    : task.getPriority(),
                    status      : task.getStatus(),
                    create_at   : task.getCreateAt(),
                    id_user     : task.getUserId(),
                },
            });

            this.logger.log(`Task created successfully with id: ${created.id}`);
            return this.toDomain(created);
        } catch (error) {
            this.logger.error('Error creating task:', error);
            throw new InternalServerErrorException(`Can't create task - Code: ${error.code}`);
        }
    }

    async findById(id: string): Promise<Task | null> {
        try {
            const taskFind = await this.prisma.tasks.findUnique({
                where: { id },
            });

            return taskFind ? this.toDomain(taskFind) : null;
        } catch (error) {
            this.logger.error('Error finding task:', error);
            throw new InternalServerErrorException(`Can't find task by id - Code: ${error.code}`);
        }
    }

    async findAll(): Promise<Task[]> {
        try {
            const tasks = await this.prisma.tasks.findMany({
                orderBy: {
                    create_at: 'desc',
                },
            });
            
            return tasks.map(task => this.toDomain(task));
        } catch (error) {
            this.handleRepositoryError('Can\'t find all tasks', error);
        }
    }

    async update(task: Task): Promise<Task> {
        try {
            const updated = await this.prisma.tasks.update({
                where: { id: task.getId() },
                data: {
                    name        : task.getName(),
                    description : task.getDescription(),
                    priority    : task.getPriority(),
                    status      : task.getStatus(),
                },
            });

            this.logger.log(`Task updated successfully with id: ${updated.id}`);
            return this.toDomain(updated);
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Task with id ${task.getId()} not found`);
            }
            this.handleRepositoryError(`Can't update task with id ${task.getId()}`, error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.tasks.delete({
                where: { id },
            });
            this.logger.log(`Task deleted successfully: ${id}`);
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Task with id ${id} not found`);
            }
            this.handleRepositoryError(`Can't delete task with id ${id}`, error);
        }
    }

    // Specific business-rules operations
    async findByUserId(
        userId: string,
        options?: {
            page      ?: number;
            limit     ?: number;
            priority  ?: string;
            status    ?: boolean;
        }
    ): Promise<{ tasks: Task[]; total: number }> {
        try {
            const page  = options?.page || 1;
            const limit = options?.limit || 10;
            const skip  = (page - 1) * limit;

            // Build filter conditions
            const where: any = { id_user: userId };
            
            if (options?.priority) {
                where.priority = options.priority;
            }
            
            if (options?.status !== undefined) {
                where.status = options.status;
            }

            // Get total count for pagination
            const total = await this.prisma.tasks.count({ where });

            // Get paginated tasks
            const tasks = await this.prisma.tasks.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    create_at: 'desc',
                },
            });

            return {
                tasks: tasks.map(task => this.toDomain(task)),
                total,
            };
        } catch (error) {
            this.handleRepositoryError(`Can't find tasks for user ${userId}`, error);
        }
    }

    async existsById(id: string): Promise<boolean> {
        try {
            const count = await this.prisma.tasks.count({
                where: { id },
            });
            return count > 0;
        } catch (error) {
            this.handleRepositoryError('Error checking task existence', error);
        }
    }

    async existsByUserAndId(userId: string, taskId: string): Promise<boolean> {
        try {
            const count = await this.prisma.tasks.count({
                where: {
                    id      : taskId,
                    id_user : userId,
                },
            });
            return count > 0;
        } catch (error) {
            this.handleRepositoryError('Error checking task ownership', error);
        }
    }

    // Private helper methods
    private toDomain(prismaTask: any): Task {
        return new Task({
            id          : prismaTask.id,
            name        : prismaTask.name,
            description : prismaTask.description,
            priority    : prismaTask.priority as TaskPriority,
            status      : prismaTask.status,
            createAt    : prismaTask.create_at,
            updateAt    : prismaTask.update_at,
            userId      : prismaTask.id_user,
        });
    }

    private handleRepositoryError(context: string, error: any): never {
        this.logger.error(`${context}:`, error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            throw new ConflictException('Task already exists');
        }
        throw new InternalServerErrorException(`Failed to ${context}`);
    }
}

