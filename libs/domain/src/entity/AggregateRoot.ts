import { BaseBrandedEntity } from '@app/domain/entity/BaseBrandedEntity';
import type { DomainEvent } from '@app/domain/event/DomainEvent';
import type { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';

export abstract class AggregateRoot<T, P> extends BaseBrandedEntity<T, P> {
  #domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this.#domainEvents;
  }

  addDomainEvent(domainEvent: DomainEvent): void {
    this.#domainEvents.push(domainEvent);
  }

  clearDomainEvents(): void {
    this.#domainEvents = [];
  }

  publishDomainEvents(eventEmitterPort: EventEmitterPort): void {
    this.#domainEvents.forEach((domainEvent) => {
      eventEmitterPort.emit(domainEvent);
    });
    this.clearDomainEvents();
  }
}
