import type { Lazy } from '@app/custom/effect';
import { E, T } from '@app/custom/effect';

export class DBError extends Error {
  constructor(error: Error) {
    super(error.message);
    Error.captureStackTrace(this, this.constructor);
    (this.stack as any) += error.stack;
  }
}

export function tryCatchDBE<V>(f: Lazy<Promise<V>>): T.IO<DBError, V> {
  return T.tryCatchPromise(f, (e) => new DBError(E.toError(e)));
}
