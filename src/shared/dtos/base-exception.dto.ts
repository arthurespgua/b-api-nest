export class BaseExceptionDto {
    readonly statusCode: number;
    readonly mensaje: string;
    readonly detalles: string[];
    readonly timestamp: string;
    readonly path?: string;

    constructor(
        statusCode: number,
        mensaje: string,
        detalles: string[] = [],
        path?: string,
    ) {
        this.statusCode = statusCode;
        this.mensaje = mensaje;
        this.detalles = detalles;
        this.timestamp = new Date().toISOString();
        this.path = path;
  }
}