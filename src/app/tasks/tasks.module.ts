import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { TasksController } from '@tasks/presentation/tasks.controller';
import { CreateTaskUseCase } from '@tasks/application/create-task/create-task.use-case';
import { UpdateTaskUseCase } from '@tasks/application/update-task/update-task.use-case';
import { DeleteTaskUseCase } from '@tasks/application/delete-task/delete-task.use-case';
import { ViewTaskUseCase } from '@tasks/application/view-task/view-task.use-case';
import { ViewTasksByUserUseCase } from '@tasks/application/view-task-byUser/view-task-byUser.use-case';
import { ViewTasksUseCase } from '@tasks/application/view-tasks/view-tasks.use-case';
import { TaskRepositoryPrisma } from '@tasks/infrastructure/repositories/task-repository.prisma';

@Module({
    imports     : [ 
        PrismaModule,
    ],
    controllers : [ TasksController ],
    providers   : [
        // Repository
        TaskRepositoryPrisma,
        {
            provide     : 'TaskRepository',
            useExisting : TaskRepositoryPrisma,
        },

        // Use Cases
        CreateTaskUseCase,
        UpdateTaskUseCase,
        DeleteTaskUseCase,
        ViewTaskUseCase,
        ViewTasksByUserUseCase,
        ViewTasksUseCase,
    ],
    exports     : []
})

export class TasksModule {}
