import { HttpError } from '@app/domain/error/HttpError';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { TaskEither } from 'fp-ts/TaskEither';

export interface HttpOption {
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, any>;
  form?: Record<string, any>;
}

export abstract class HttpClientPort {
  abstract get(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse>;

  abstract post(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse>;

  abstract put(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse>;

  abstract patch(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse>;

  abstract delete(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse>;
}
