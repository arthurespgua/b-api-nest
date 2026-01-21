import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '@config';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
    id    : string;
    email : string;
    name  : string;
}

export interface JwtTokenData extends JwtPayload {
    iat : number;
    exp : number;
}

@Injectable()
export class JwtService {
    private readonly secret : string;

    constructor() {
        this.secret = JWT_SECRET as string;

        if (!this.secret) {
            throw new Error('JWT_SECRET must be defined in environment variables');
        }
    }

    generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.secret, {
            algorithm: 'HS256',
            expiresIn: '24h',
        });
    }

    verifyToken(token: string): JwtTokenData {
        try {
            const decoded = jwt.verify(token, this.secret, {
                algorithms: ['HS256'],
            }) as JwtTokenData;

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException('Token has expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token');
            }
            throw new UnauthorizedException('Token verification failed');
        }
    }

    decodeToken(token: string): JwtTokenData | null {
        try {
            return jwt.decode(token) as JwtTokenData;
        } catch {
            return null;
        }
    }

    extractTokenFromHeader(authHeader?: string): string | null {
        if (!authHeader) return null;
        
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
}
