import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionDto } from '@shared/dtos/base-exception.dto';
import { DomainError } from '@shared/core/DomainError';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx      = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request  = ctx.getRequest<Request>();
        const path     = request?.url ?? 'unknown';

        this.logger.error(
            `Exception caught: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
            exception instanceof Error ? exception.stack : undefined
        );

        let status  = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Ha ocurrido un error inesperado';

        let details : string[] = ['Error interno del servidor'];
        let code    : string | undefined;

        // 1. Manejo de DomainErrors (errores de negocio)
        if (exception instanceof DomainError) {
            status  = exception.statusCode;
            message = exception.message;
            code    = exception.code;
            details = exception.details
                ? [typeof exception.details === 'string' ? exception.details : JSON.stringify(exception.details)]
                : [exception.message];
        }
        // 2. Manejo de HttpException de NestJS
        else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                details = [exceptionResponse];
            } else if (typeof exceptionResponse === 'object') {
                const response = exceptionResponse as any;

                message = response.message || response.error || exception.message;
                details = Array.isArray(response.message) 
                    ? response.message 
                    : [response.message || response.error || exception.message];
                code = response.code;
            }
        }
        // 3. Manejo de errores de Prisma
        else if (this.isPrismaError(exception)) {
            const prismaError     = exception as Prisma.PrismaClientKnownRequestError;
            const prismaErrorInfo = this.handlePrismaError(prismaError);

            status  = prismaErrorInfo.status;
            message = prismaErrorInfo.message;
            details = [prismaErrorInfo.detail];
            code    = prismaError.code;
        }
        // 4. Errores de validación de class-validator
        else if (exception instanceof Error && exception.name === 'ValidationError') {
            status  = HttpStatus.BAD_REQUEST;
            message = 'Error de validación';
            details = [exception.message];
        }
        // 5. Errores genéricos de Error
        else if (exception instanceof Error) {
            // En producción, no exponemos detalles del error
            if (process.env.NODE_ENV === 'production') {
                message = 'Error interno del servidor';
                details = ['Ha ocurrido un error inesperado'];
            } else {
                message = exception.message;
                details = [exception.message];
            }
        }
        // 6. Errores desconocidos
        else {
            message = 'Error desconocido';
            details = [String(exception)];
        }

        // Construir respuesta estandarizada
        const errorResponse = new BaseExceptionDto(
            status,
            message,
            details,
            path,
            code
        );

        // Log adicional para errores 500
        if (status >= 500) {
            this.logger.error(
                `Internal Server Error: ${JSON.stringify(errorResponse)}`,
                exception instanceof Error ? exception.stack : undefined
            );
        }

        response.status(status).json(errorResponse);
    }

    private isPrismaError(exception: unknown): boolean {
        return (
            exception instanceof Prisma.PrismaClientKnownRequestError ||
            exception instanceof Prisma.PrismaClientValidationError ||
            exception instanceof Prisma.PrismaClientInitializationError ||
            exception instanceof Prisma.PrismaClientRustPanicError
        );
    }

    private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
        status  : number;
        message : string;
        detail  : string;
    } {
        switch (error.code) {
            case 'P2000':
                return {
                    status  : HttpStatus.BAD_REQUEST,
                    message : 'El valor proporcionado es demasiado largo',
                    detail  : error.message,
                };
            case 'P2001':
                return {
                    status  : HttpStatus.NOT_FOUND,
                    message : 'Registro no encontrado',
                    detail  : 'El registro que buscas no existe',
                };
            case 'P2002':
                const field = (error.meta?.target as string[])?.join(', ') || 'campo';
                return {
                    status  : HttpStatus.CONFLICT,
                    message : `Ya existe un registro con ese ${field}`,
                    detail  : `Violación de restricción única en: ${field}`,
                };
            case 'P2003':
                return {
                    status  : HttpStatus.BAD_REQUEST,
                    message : 'Violación de clave foránea',
                    detail  : 'El registro referenciado no existe',
                };
            case 'P2025':
                return {
                    status  : HttpStatus.NOT_FOUND,
                    message : 'Registro no encontrado para actualizar o eliminar',
                    detail  : error.message,
                };
            default:
                return {
                    status  : HttpStatus.INTERNAL_SERVER_ERROR,
                    message : 'Error de base de datos',
                    detail  : process.env.NODE_ENV === 'production'
                        ? 'Ha ocurrido un error al procesar tu solicitud'
                        : error.message,
                };
        }
    }
}
