import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConnectionError } from './connection-error.exception';
import { BaseExceptionDto } from '../dtos/base-exception.dto';
import { DepartmentNotFoundError } from '@src/app/departments/application/errors/department-not-found.error';
import { DirectorNotFoundError } from '@src/app/departments/application/errors/director-not-found.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx      = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request  = ctx.getRequest<Request>();
        const path     = request?.url ?? undefined;

        let status   = 500;
        let mensaje  = 'Ha ocurrido un error inesperado.';
        let detalles = ['Error desconocido'];

        // Mapeo de errores custom

        const errorResponse = new BaseExceptionDto(status, mensaje, detalles, path);
        response.status(status).json(errorResponse);
    }
}
