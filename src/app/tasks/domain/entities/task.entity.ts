import { ValidationError } from '@shared/core/DomainError';

export enum TaskPriority {
    LOW    = 'baja',
    MEDIUM = 'media',
    HIGH   = 'alta',
}

export type TaskProps = {
    id          : string;
    name        : string;
    description : string;
    priority    : TaskPriority;
    status      : boolean;
    createAt    : Date;
    updateAt    : Date;
    userId      : string;
};

export class Task {
    private readonly id          : string;
    private readonly name        : string;
    private readonly description : string;
    private readonly priority    : TaskPriority;
    private readonly status      : boolean;
    private readonly createAt    : Date;
    private readonly updateAt    : Date;
    private readonly userId      : string;

    constructor(props: TaskProps) {
        this.id          = props.id;
        this.name        = props.name;
        this.description = props.description;
        this.priority    = props.priority;
        this.status      = props.status;
        this.createAt    = props.createAt;
        this.updateAt    = props.updateAt;
        this.userId      = props.userId;
    }

    // Factory method for creating new tasks
    static create(props: Omit<TaskProps, 'updateAt'>): Task {
        this.validateName(props.name);
        this.validateDescription(props.description);
        this.validatePriority(props.priority);

        return new Task({
            ...props,
            updateAt: props.createAt,
        });
    }

    // Factory method for updating existing tasks
    static withUpdate(props: TaskProps): Task {
        this.validateName(props.name);
        this.validateDescription(props.description);
        this.validatePriority(props.priority);

        return new Task({
            ...props,
            updateAt: new Date(),
        });
    }

    // Validations
    private static validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw ValidationError.field('name', 'Task name cannot be empty');
        }
        if (name.length > 52) {
            throw ValidationError.field('name', 'Task name must be at most 52 characters');
        }
    }

    private static validateDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw ValidationError.field('description', 'Task description cannot be empty');
        }
        if (description.length > 256) {
            throw ValidationError.field('description', 'Task description must be at most 256 characters');
        }
    }

    private static validatePriority(priority: TaskPriority): void {
        const validPriorities = Object.values(TaskPriority);
        if (!validPriorities.includes(priority)) {
            throw ValidationError.field(
                'priority',
                `Priority must be one of: ${validPriorities.join(', ')}`
            );
        }
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getPriority(): TaskPriority {
        return this.priority;
    }

    getStatus(): boolean {
        return this.status;
    }

    getCreateAt(): Date {
        return this.createAt;
    }

    getUpdateAt(): Date {
        return this.updateAt;
    }

    getUserId(): string {
        return this.userId;
    }

    // Business methods
    isCompleted(): boolean {
        return this.status === true;
    }

    isPending(): boolean {
        return this.status === false;
    }

    isHighPriority(): boolean {
        return this.priority === TaskPriority.HIGH;
    }
}
