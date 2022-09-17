import { HttpError } from '@app/domain/error/HttpError';
import { TaskEither } from 'fp-ts/TaskEither';

export interface HttpResponse {
  isOk(): boolean;

  statusCode(): number;

  toEntity<T>(entity: { new (...args: any[]): T }): TaskEither<HttpError, T>;

  body(): TaskEither<HttpError, string>;
}
