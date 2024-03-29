import type { DomainEvent } from '@app/domain/event/DomainEvent';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';

export class StubEventEmitter extends EventEmitterPort {
  #queue = new Map<string, DomainEvent>();

  clear() {
    this.#queue.clear();
  }

  get(event: string): unknown {
    return this.#queue.get(event);
  }

  override emit(event: DomainEvent) {
    this.#queue.set(event.constructor.name, event);
  }
}
