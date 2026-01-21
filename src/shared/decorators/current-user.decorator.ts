import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtTokenData } from '@shared/services/jwt.service';

export const CurrentUser = createParamDecorator(
    (data: keyof JwtTokenData | undefined, ctx: ExecutionContext): JwtTokenData | any => {
        const request = ctx.switchToHttp().getRequest();
        const user    = request.user;

        return data ? user?.[data] : user;
    },
);
