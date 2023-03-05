import { T, pipe } from '@app/custom/effect';
import { liveTracer } from '@app/monitoring/init';
import { Span, SpanImpl } from '@effect-ts/otel';
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Span as ApiSpan } from '@opentelemetry/api';
import { trace } from '@opentelemetry/api';
import type { Observable } from 'rxjs';
import { mergeMap } from 'rxjs';

@Injectable()
export class EffectInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (value) => {
        if (value instanceof T.Base) {
          return pipe(
            value,
            T.provideService(Span)(
              new SpanImpl(trace.getActiveSpan() as ApiSpan),
            ),
            liveTracer,
            T.runPromise,
          );
        }

        return value;
      }),
    );
  }
}
