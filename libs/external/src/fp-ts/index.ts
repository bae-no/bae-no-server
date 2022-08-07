import { AuthError } from '@app/domain/error/AuthError';
import { AuthenticationError } from 'apollo-server-express';
import { identity } from 'fp-ts/function';
import { pipe } from 'fp-ts/function';
import { Task } from 'fp-ts/Task';
import { getOrElse, TaskEither, map } from 'fp-ts/TaskEither';

export * as TE from 'fp-ts/TaskEither';
export * as O from 'fp-ts/Option';

export const toResponse =
  <FROM, TO, ERROR extends Error>(
    transformFn: (value: FROM) => TO = identity as any,
  ) =>
  (param: TaskEither<ERROR, FROM>): Task<TO> =>
    pipe(
      param,
      map(transformFn),
      getOrElse((err) => {
        if (err instanceof AuthError) {
          throw new AuthenticationError(err.message);
        }

        throw err;
      }),
    );
