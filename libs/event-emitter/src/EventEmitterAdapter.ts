import type { DomainEvent } from '@app/domain/event/DomainEvent';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import type { EventEmitter2 } from '@nestjs/event-emitter';

export class EventEmitterAdapter extends EventEmitterPort {
  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  override emit(event: DomainEvent): void {
    this.eventEmitter.emit(event.constructor.name, event);
  }
}
