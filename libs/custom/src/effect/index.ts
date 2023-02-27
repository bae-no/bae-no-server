export * as T from '@effect-ts/core/Effect';
export * as OT from '@effect-ts/otel';
export * as M from '@effect-ts/core/Effect/Managed';
export * as L from '@effect-ts/core/Effect/Layer';
export * as O from '@effect-ts/core/Option';
export * as E from '@effect-ts/core/Either';
export * as NEA from '@effect-ts/core/Collections/Immutable/NonEmptyArray';
export { pipe, Lazy } from '@effect-ts/core/Function';

export function constVoid(): void {
  return;
}
