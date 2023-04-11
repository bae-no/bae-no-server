export interface Publisher {
  publish<T = unknown>(trigger: string, data: T): void;
}

export interface Subscriber {
  subscribe<T>(trigger: string): AsyncIterator<T>;
}

export abstract class PubSubPort implements Publisher, Subscriber {
  abstract publish<T = unknown>(trigger: string, data: T): void;

  abstract subscribe<T>(trigger: string): AsyncIterator<T>;
}
