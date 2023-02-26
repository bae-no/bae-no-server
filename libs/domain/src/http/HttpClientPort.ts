import type { T } from '@app/custom/effect';
import type { HttpError } from '@app/domain/error/HttpError';
import type { HttpResponse } from '@app/domain/http/HttpResponse';

export interface HttpOption {
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, any>;
  form?: Record<string, any>;
}

export abstract class HttpClientPort {
  abstract get(url: string, option?: HttpOption): T.IO<HttpError, HttpResponse>;

  abstract post(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse>;

  abstract put(url: string, option?: HttpOption): T.IO<HttpError, HttpResponse>;

  abstract patch(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse>;

  abstract delete(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse>;
}
