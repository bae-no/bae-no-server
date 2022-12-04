export class DomainEvent {
  readonly timestamp: number;

  constructor() {
    this.timestamp = Date.now();
  }
}
