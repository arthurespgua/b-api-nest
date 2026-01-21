import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TaskMapper } from '@tasks/infrastructure/mappers/task.mapper';
import { CreateTaskUseCase } from '@tasks/application/create-task/create-task.use-case';
import { UpdateTaskUseCase } from '@tasks/application/update-task/update-task.use-case';
import { DeleteTaskUseCase } from '@tasks/application/delete-task/delete-task.use-case';
import { ViewTaskUseCase } from '@tasks/application/view-task/view-task.use-case';
import { ViewTasksByUserUseCase, ViewTasksByUserOutput } from '@tasks/application/view-task-byUser/view-task-byUser.use-case';
import { ViewTasksUseCase, ViewTasksOutput } from '@tasks/application/view-tasks/view-tasks.use-case';
import { CreateTaskDto } from '@tasks/presentation/dto/create-task.dto';
import { UpdateTaskDto } from '@tasks/presentation/dto/update-task.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { JwtTokenData } from '@shared/services/jwt.service';
import { ForbiddenError } from '@shared/core/DomainError';
import { Public } from '@shared/decorators/public.decorator';
import { TaskPriority } from '@tasks/domain/entities/task.entity';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly createTask       : CreateTaskUseCase,
        private readonly updateTask       : UpdateTaskUseCase,
        private readonly deleteTask       : DeleteTaskUseCase,
        private readonly viewTask         : ViewTaskUseCase,
        private readonly viewTasksByUser  : ViewTasksByUserUseCase,
        private readonly viewTasks        : ViewTasksUseCase,
    ) {}

    // Basic CRUD operations
    @Get()
    @Public()
    async findAll(): Promise<ViewTasksOutput> {
        return await this.viewTasks.execute();
    }

    @Get('todo/list')
    async findMyTasks(
        @CurrentUser() user: JwtTokenData,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('priority') priority?: TaskPriority,
        @Query('status') status?: string,
    ): Promise<ViewTasksByUserOutput> {
        return await this.viewTasksByUser.execute({ 
            userId   : user.id,
            page     : page ? parseInt(page, 10) : undefined,
            limit    : limit ? parseInt(limit, 10) : undefined,
            priority : priority,
            status   : status === 'true' ? true : status === 'false' ? false : undefined,
        });
    }

    @Get('todo/list/:id')
    async findOne(
        @Param('id') id: string,
        @CurrentUser() user: JwtTokenData
    ) {
        const task = await this.viewTask.execute({ id, userId: user.id });

        if (!task) {
            throw ForbiddenError.insufficientPermissions('view this task');
        }

        return task;
    }

    @Post('todo/create')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @CurrentUser() user: JwtTokenData
    ) {
        const createTaskCommand = TaskMapper.fromDtoToCommand(createTaskDto, user.id);
        const result = await this.createTask.execute(createTaskCommand);

        if (result.isFailure()) {
            const error = result.getError();
            throw error;
        }

        return {
            message : 'Task created successfully',
            data    : result.getValue()
        };
    }

    @Patch('todo/update/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @CurrentUser() user: JwtTokenData
    ) {
        const result = await this.updateTask.execute({
            id,
            ...updateTaskDto,
            userId: user.id,
        });

        if (result.isFailure()) {
            const error = result.getError();
            throw error;
        }

        return {
            message : 'Task updated successfully',
            data    : result.getValue()
        };
    }

    @Delete('todo/list/:id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @Param('id') id: string,
        @CurrentUser() user: JwtTokenData
    ) {
        const result = await this.deleteTask.execute({
            id,
            userId: user.id,
        });

        if (result.isFailure()) {
            const error = result.getError();
            throw error;
        }

        return {
            message : 'Task deleted successfully',
        };
    }
}
