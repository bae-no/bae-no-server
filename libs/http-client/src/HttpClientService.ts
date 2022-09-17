import { TE } from '@app/domain/../../external/src/fp-ts';
import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort, HttpOption } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { NodeFetchResponse } from '@app/http-client/NodeFetchResponse';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

@Injectable()
export class HttpClientService extends HttpClientPort {
  #timeout = 10000;

  constructor() {
    super();
  }

  override get(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send('GET', url, option);
  }

  override post(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send('POST', url, option);
  }

  override put(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send('PUT', url, option);
  }

  override patch(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send('PATCH', url, option);
  }

  override delete(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send('DELETE', url, option);
  }

  private send(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.#timeout);

    return pipe(
      TE.tryCatch(
        async () => {
          try {
            return fetch(url + this.makeSearchParam(option), {
              method,
              body: this.makeBody(option),
              headers: option?.headers,
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeout);
          }
        },
        (e) => new HttpError(e as Error),
      ),
      TE.map((response) => new NodeFetchResponse(response)),
    );
  }

  private makeBody(option?: HttpOption): string | undefined {
    if (option?.body) {
      return JSON.stringify(option.body);
    }

    if (option?.form) {
      return new URLSearchParams(option.form).toString();
    }

    return undefined;
  }

  private makeSearchParam(option?: HttpOption): string {
    if (option?.query) {
      return new URLSearchParams(option.query).toString();
    }

    return '';
  }
}
