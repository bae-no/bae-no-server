import { T } from '@app/custom/effect';
import { toError } from 'fp-ts/Either';
import type { Lazy } from 'fp-ts/function';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';
import { tryCatch } from 'fp-ts/TaskEither';

export class DBError extends Error {
  constructor(error: Error) {
    super(error.message);
    Error.captureStackTrace(this, this.constructor);
    (this.stack as any) += error.stack;
  }
}

export function tryCatchDB<T>(f: Lazy<Promise<T>>): TaskEither<DBError, T> {
  return pipe(tryCatch(f, (e) => new DBError(toError(e))));
}

export function tryCatchDBE<E>(f: Lazy<Promise<E>>): T.IO<DBError, E> {
  return T.tryCatchPromise(f, (e) => new DBError(toError(e)));
}
