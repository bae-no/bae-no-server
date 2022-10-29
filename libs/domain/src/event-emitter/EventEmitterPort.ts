export abstract class EventEmitterPort {
  abstract emit(event: string, data: unknown): void;

  abstract emitAsync(event: string, data: unknown): void;
}
