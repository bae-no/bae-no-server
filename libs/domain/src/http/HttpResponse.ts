export interface HttpResponse {
  isOk(): boolean;

  statusCode(): number;

  toEntity<T>(entity: { new (...args: any[]): T }): T;

  body(): string;
}
