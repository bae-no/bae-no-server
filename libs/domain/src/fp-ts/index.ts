import { pipe } from 'fp-ts/function';
import { Task } from 'fp-ts/Task';
import { getOrElse, TaskEither, map } from 'fp-ts/TaskEither';

export * as TE from 'fp-ts/TaskEither';
export * as O from 'fp-ts/Option';

export const toResponse =
  <FROM, TO, ERROR>(transformFn: (value: FROM) => TO) =>
  (param: TaskEither<ERROR, FROM>): Task<TO> =>
    pipe(
      param,
      map(transformFn),
      getOrElse((err) => {
        throw err;
      }),
    );
