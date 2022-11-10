export abstract class EventEmitterPort {
  abstract emit(event: string, data: unknown): void;
}
