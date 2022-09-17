import { HttpError } from '@app/domain/error/HttpError';
import { Either } from 'fp-ts/Either';

export interface HttpResponse {
  get isOk(): boolean;

  get statusCode(): number;

  get body(): string;

  toEntity<T>(entity: { new (...args: any[]): T }): Either<HttpError, T>;
}
