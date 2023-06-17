import type { DomainEvent } from '@app/domain/event/DomainEvent';

export type Constructor<T extends DomainEvent> = new (...args: any[]) => T;

export const EVENTS_METADATA = Symbol('EVENTS_METADATA');

export function OnDomainEvent<T extends DomainEvent>(
  cls: Constructor<T> | Constructor<T>[],
): MethodDecorator {
  return function (target, propertyKey) {
    Reflect.defineMetadata(
      EVENTS_METADATA,
      Array.isArray(cls) ? cls : [cls],
      target,
      propertyKey,
    );
  };
}
