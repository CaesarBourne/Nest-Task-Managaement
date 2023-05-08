import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, req: ExecutionContext): User => {
    // console.log('decorator request ', req.switchToHttp().getRequest().user);
    //   console.log('decorator data ', data);
    return req.switchToHttp().getRequest().user;
  },
);
