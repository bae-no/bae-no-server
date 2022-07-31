export interface Publisher {
  publish(trigger: string, data: unknown): void;
}

export interface Subscriber {
  subscribe<T>(trigger: string): AsyncIterator<T>;
}

export abstract class PubSubPort implements Publisher, Subscriber {
  abstract publish(trigger: string, data: unknown): void;

  abstract subscribe<T>(trigger: string): AsyncIterator<T>;
}
