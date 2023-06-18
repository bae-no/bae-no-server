import type { DomainEvent } from '@app/domain/event/DomainEvent';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { EVENT_QUEUE } from '@app/event-emitter/constant';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EventEmitterAdapter extends EventEmitterPort {
  private readonly logger = new Logger(EventEmitterAdapter.name);

  constructor(
    @(InjectQueue(EVENT_QUEUE) as any)
    private readonly queue: Queue,
  ) {
    super();
  }

  override emit(event: DomainEvent): void {
    this.queue
      .add(event.constructor.name, event)
      .then()
      .catch(() =>
        this.logger.error(
          `emit error: name=${event.constructor.name} event=${JSON.stringify(
            event,
          )}`,
        ),
      );
  }
}
