import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValid } from 'ulid';

@Injectable()
export class ParseULIDPipe implements PipeTransform {
    transform(value: string) {
        if (!isValid(value)) throw new BadRequestException('Invalid ULID');
        return value;
    }
}
