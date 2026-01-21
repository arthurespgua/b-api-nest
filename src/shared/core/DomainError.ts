export abstract class DomainError extends Error {
    public readonly code        : string;
    public readonly statusCode  : number;
    public readonly details    ?: any;

    protected constructor(message: string, code: string, statusCode: number, details?: any) {
        super(message);
        this.name       = this.constructor.name;
        this.code       = code;
        this.statusCode = statusCode;
        this.details    = details;
        
        // Mantiene el stack trace correcto
        Error.captureStackTrace(this, this.constructor);
    }

    public toJSON() {
        return {
            name       : this.name,
            code       : this.code,
            message    : this.message,
            statusCode : this.statusCode,
            details    : this.details,
        };
    }
}

export class NotFoundError extends DomainError {
    constructor(message: string, details?: any) {
        super(message, 'NOT_FOUND', 404, details);
    }

    static entity(entityName: string, identifier: string | number): NotFoundError {
        return new NotFoundError(
            `${entityName} with identifier ${identifier} not found`,
            { entityName, identifier }
        );
    }
}

export class ValidationError extends DomainError {
    constructor(message: string, details?: any) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }

    static field(fieldName: string, reason: string): ValidationError {
        return new ValidationError(
            `Validation failed for field '${fieldName}': ${reason}`,
            { fieldName, reason }
        );
    }

    static multiple(errors: Array<{ field: string; message: string }>): ValidationError {
        return new ValidationError(
            'Multiple validation errors occurred',
            { errors }
        );
    }
}

export class UnauthorizedError extends DomainError {
    constructor(message: string, details?: any) {
        super(message, 'UNAUTHORIZED', 401, details);
    }

    static invalidCredentials(): UnauthorizedError {
        return new UnauthorizedError('Invalid credentials provided');
    }

    static tokenExpired(): UnauthorizedError {
        return new UnauthorizedError('Authentication token has expired');
    }

    static tokenInvalid(): UnauthorizedError {
        return new UnauthorizedError('Invalid authentication token');
    }
}

export class ForbiddenError extends DomainError {
    constructor(message: string, details?: any) {
        super(message, 'FORBIDDEN', 403, details);
    }

    static insufficientPermissions(action: string): ForbiddenError {
        return new ForbiddenError(
            `You don't have permission to ${action}`,
            { action }
        );
    }
}

export class ConflictError extends DomainError {
    constructor(message: string, details?: any) {
        super(message, 'CONFLICT', 409, details);
    }

    static alreadyExists(entityName: string, field: string, value: any): ConflictError {
        return new ConflictError(
            `${entityName} with ${field} '${value}' already exists`,
            { entityName, field, value }
        );
    }
}

export class BusinessRuleError extends DomainError {
    constructor(message: string, code: string, details?: any) {
        super(message, code, 422, details);
    }
}

export class InternalError extends DomainError {
    constructor(message: string, details?: any) {
        super(message, 'INTERNAL_ERROR', 500, details);
    }

    static unexpected(originalError?: Error): InternalError {
        return new InternalError(
            'An unexpected error occurred',
            { originalError: originalError?.message, stack: originalError?.stack }
        );
    }
}
