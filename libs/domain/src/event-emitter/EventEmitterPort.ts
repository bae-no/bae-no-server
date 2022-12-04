import { DomainEvent } from '@app/domain/event/DomainEvent';

export abstract class EventEmitterPort {
  abstract emit(event: DomainEvent): void;
}
