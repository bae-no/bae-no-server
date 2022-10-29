import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';

export class StubEventEmitter extends EventEmitterPort {
  #queue = new Map<string, any>();

  clear() {
    this.#queue.clear();
  }

  get(event: string): unknown {
    return this.#queue.get(event);
  }

  override emit(event: string, data: unknown) {
    this.#queue.set(event, data);
  }

  emitAsync(event: string, data: unknown): void {
    this.#queue.set(event, data);
  }
}
