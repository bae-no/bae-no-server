import type { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from './Public';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const req = GqlExecutionContext.create(context).getContext().req;

    if (req.subscriptions) {
      req.headers = Object.entries(req.connectionParams ?? {}).reduce(
        (acc, [key, value]) => {
          acc[key.toLowerCase()] = value;

          return acc;
        },
        {} as Record<string, unknown>,
      );
    }

    return req;
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
