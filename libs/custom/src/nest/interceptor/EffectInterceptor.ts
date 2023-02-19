import { T, pipe } from '@app/custom/effect';
import { liveTracer } from '@app/monitoring/init';
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { mergeMap } from 'rxjs';

@Injectable()
export class EffectInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (value) => {
        if (value instanceof T.Base) {
          return pipe(value, liveTracer, T.runPromise);
        }

        return value;
      }),
    );
  }
}
