import { toError } from 'fp-ts/Either';
import { Lazy, pipe } from 'fp-ts/function';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';

export class DBError extends Error {
  constructor(message: Error) {
    super(message.message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function tryCatchDB<T>(f: Lazy<Promise<T>>): TaskEither<DBError, T> {
  return pipe(tryCatch(f, (e) => new DBError(toError(e))));
}
