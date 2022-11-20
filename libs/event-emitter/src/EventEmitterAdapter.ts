import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class EventEmitterAdapter extends EventEmitterPort {
  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  override emit(event: string, data: unknown): void {
    this.eventEmitter.emit(event, data);
  }
}
