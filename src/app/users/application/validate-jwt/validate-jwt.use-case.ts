import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@users/domain/repositories/user-repository.interface';
import { JWT_SECRET } from "@src/config";
import * as jwt from 'jsonwebtoken';

export type ValidateJwtInput = {
    token : string;
}

export type ValidateJwtOutput = {
    isValid  : boolean;
    id      ?: string;
    email   ?: string;
    name    ?: string;
    message ?: {
        messageByDefault : string;
        messageInSpanish : string;
    };
};

@Injectable()
export class ValidateJwtUseCase {
    constructor(
        @Inject('UserRepository') private readonly userRepository : UserRepository,
    ) {}

    async execute(input: ValidateJwtInput): Promise<ValidateJwtOutput> {
        try {
            // 1. Validate the JWT token
            const decoded = jwt.verify(input.token, JWT_SECRET, { algorithms: ['HS256'] }) as ValidateJwtOutput;

            // 2. Check if the user exists in the database
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new UnauthorizedException({
                    messageByDefault : 'User not found',
                    messageInSpanish : 'Usuario no encontrado',
                });
            }

            // 2. Return the decoded token
            return {
                isValid : true,
                id      : decoded.id,
                email   : decoded.email,
                name    : decoded.name,
            };
        } catch (error) {
            return {
                isValid : false,
                message : error.name === 'TokenExpiredError'
                    ? { messageByDefault: 'Token expired', messageInSpanish: 'Token expirado' }
                    : { messageByDefault: 'Invalid token', messageInSpanish: 'Token inválido' },
            };
        }
    }
}