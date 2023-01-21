import { BaseEntity } from '@app/domain/entity/BaseEntity';
import { DomainEvent } from '@app/domain/event/DomainEvent';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';

export abstract class AggregateRoot<T> extends BaseEntity<T> {
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
