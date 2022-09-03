import { AuthError } from '@app/domain/error/AuthError';
import { AuthenticationError } from 'apollo-server-express';
import { pipe } from 'fp-ts/function';
import { Task } from 'fp-ts/Task';
import { getOrElse, TaskEither, map } from 'fp-ts/TaskEither';

export * as TE from 'fp-ts/TaskEither';
export * as O from 'fp-ts/Option';

export const toResponse =
  <FROM, TO, ERROR extends Error>(transformFn: (value: FROM) => TO) =>
  (param: TaskEither<ERROR, FROM>): Task<TO> =>
    pipe(
      param,
      map(transformFn),
      getOrElse((err) => {
        if (err instanceof AuthError) {
          const error = new AuthenticationError(err.message, err);
          error.stack = err.stack;
          throw error;
        }

        throw err;
      }),
    );

export const toResponseArray =
  <FROM, TO, ERROR extends Error>(transformFn: (value: FROM) => TO) =>
  (param: TaskEither<ERROR, FROM[]>): Task<TO[]> =>
    pipe(
      param,
      map((param) => param.map(transformFn)),
      getOrElse((err) => {
        if (err instanceof AuthError) {
          const error = new AuthenticationError(err.message, err);
          error.stack = err.stack;
          throw error;
        }

        throw err;
      }),
    );
