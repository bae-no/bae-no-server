import { toError } from 'fp-ts/Either';
import { Lazy, pipe } from 'fp-ts/function';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';

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
