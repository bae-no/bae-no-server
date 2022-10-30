import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventEmitterAdapter extends EventEmitterPort {
  private readonly logger = new Logger(EventEmitterAdapter.name);

  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  override emit(event: string, data: unknown): void {
    this.eventEmitter.emit(event, data);
  }

  override emitAsync(event: string, data: unknown): void {
    this.eventEmitter.emitAsync(event, data).catch((error) => {
      this.logger.error(
        `내부 이벤트 전송실패: event=${error} data=${JSON.stringify(data)}`,
        error,
      );
    });
  }
}
