import { HttpError } from '@app/domain/error/HttpError';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { TaskEither } from 'fp-ts/TaskEither';

export interface HttpOption {
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, any>;
}

export interface HttpClientPort {
  get(url: string, option?: HttpOption): TaskEither<HttpError, HttpResponse>;
}
