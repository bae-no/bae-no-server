import { O, T } from '@app/custom/effect';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import type * as TE from 'fp-ts/TaskEither';

function noop(): void {
  return;
}

export function assertNone<A>(e: O.Option<A>): asserts e is O.None {
  pipe(
    e,
    O.fold(
      () => ({}),
      (a) => {
        throw new Error(`None expected, got a Some: ${a}`);
      },
    ),
  );
}

export function assertSome<A>(
  e: O.Option<A>,
  onSome: (a: A) => void = noop,
): asserts e is O.Some<A> {
  pipe(
    e,
    O.fold(() => {
      throw new Error('Some expected, got a None');
    }, onSome),
  );
}

export function assertRight<L, A>(
  e: E.Either<L, A>,
  onRight: (a: A) => void = noop,
): asserts e is E.Right<A> {
  pipe(
    e,
    E.fold((l) => {
      throw new Error(`Right expected, got a Left: ${l}`);
    }, onRight),
  );
}

export function assertLeft<L, A>(
  e: E.Either<L, A>,
  onLeft: (a: L) => void = noop,
): asserts e is E.Left<L> {
  pipe(
    e,
    E.fold(onLeft, (a) => {
      throw new Error(`Left expected, got a Right: ${a}`);
    }),
  );
}

export async function assertResolvesRight<L, A>(
  e: TE.TaskEither<L, A>,
  onRight: (a: A) => void = noop,
): Promise<void> {
  assertRight(await e(), onRight);
}

export async function assertResolvesLeft<L, A>(
  e: TE.TaskEither<L, A>,
  onLeft: (a: L) => void = noop,
): Promise<void> {
  assertLeft(await e(), onLeft);
}

export function expectNonNullable<A>(
  value: A | null | undefined,
): asserts value is NonNullable<A> {
  if (value === null || value === undefined) {
    throw new Error(`Expected non-nullable, got null`);
  }
}

export function gql(strings: TemplateStringsArray, ..._: string[]): string {
  return strings.join('');
}

export async function assertResolvesSuccess<L, A>(
  e: T.IO<L, A>,
  onSuccess: (a: A) => void = noop,
): Promise<void> {
  await pipe(
    e,
    T.fold((l) => {
      throw new Error(`Succeed expected, got a Fail: ${l}`);
    }, onSuccess),
    T.runPromise,
  );
}

export async function assertResolvesFail<L, A>(
  e: T.IO<L, A>,
  onFail: (a: L) => void = noop,
): Promise<void> {
  await pipe(
    e,
    T.fold(onFail, (a) => {
      throw new Error(`Fail expected, got a Succeed: ${a}`);
    }),
    T.runPromise,
  );
}
