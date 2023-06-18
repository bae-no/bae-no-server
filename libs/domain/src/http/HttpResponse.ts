import type { E } from '@app/custom/effect';
import type { HttpError } from '@app/domain/error/HttpError';

export interface HttpResponse {
  get isOk(): boolean;

  get statusCode(): number;

  get body(): string;

  toEntity<T>(entity: new (...args: any[]) => T): E.Either<HttpError, T>;
}
