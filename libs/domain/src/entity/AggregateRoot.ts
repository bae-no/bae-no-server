import { BaseEntity } from '@app/domain/entity/BaseEntity';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { DomainEvent } from '@app/domain/event/DomainEvent';

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
