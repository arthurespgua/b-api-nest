export class BaseExceptionDto {
    readonly statusCode  : number;
    readonly message     : string;
    readonly details     : string[];
    readonly timestamp   : string;
    readonly path       ?: string;
    readonly code       ?: string;

    constructor(
        statusCode  : number,
        message     : string,
        details     : string[] = [],
        path       ?: string,
        code       ?: string,
    ) {
        this.statusCode = statusCode;
        this.message    = message;
        this.details    = details;
        this.timestamp  = new Date().toISOString();
        this.path       = path;
        this.code       = code;
    }
}