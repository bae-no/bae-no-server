import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventEmitterAdapter extends EventEmitterPort {
  constructor(private eventEmitter: EventEmitter2) {
    super();
  }

  override emit(event: string, data: unknown): void {
    this.eventEmitter.emit(event, data);
  }
}
