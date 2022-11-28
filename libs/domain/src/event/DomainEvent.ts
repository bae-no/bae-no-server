import { nanoid } from 'nanoid';

export class DomainEvent {
  readonly id: string;
  readonly timestamp: number;

  constructor() {
    this.id = nanoid();
    this.timestamp = Date.now();
  }
}
