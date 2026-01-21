import { Task } from '../entities/task.entity';

export interface TaskRepository {
    // Basic CRUD operations
    create(task: Task)   : Promise<Task>;
    findById(id: string) : Promise<Task | null>;
    findAll()            : Promise<Task[]>;
    update(task: Task)   : Promise<Task>;
    delete(id: string)   : Promise<void>;

    // Specific business-rules operations
    findByUserId(
        userId: string, 
        options?: {
            page      ?: number;
            limit     ?: number;
            priority  ?: string;
            status    ?: boolean;
        }
    ): Promise<{ tasks: Task[]; total: number }>;
    existsById(id: string)                            : Promise<boolean>;
    existsByUserAndId(userId: string, taskId: string) : Promise<boolean>;
}