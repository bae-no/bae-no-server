import { TE } from '@app/domain/../../external/src/fp-ts';
import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort, HttpOption } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { GotResponse } from '@app/http-client/GotResponse';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';
import got, { GotRequestFunction } from 'got';

@Injectable()
export class HttpClientService extends HttpClientPort {
  private readonly instance = got.extend({
    timeout: {
      connect: 5000,
      request: 10000,
    },
  });

  override get(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send(this.instance.get, url, option);
  }

  override post(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send(this.instance.post, url, option);
  }

  override put(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send(this.instance.put, url, option);
  }

  override patch(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send(this.instance.patch, url, option);
  }

  override delete(
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return this.send(this.instance.delete, url, option);
  }

  private send(
    method: GotRequestFunction,
    url: string,
    option?: HttpOption,
  ): TaskEither<HttpError, HttpResponse> {
    return pipe(
      TE.tryCatch(
        async () =>
          method(url, {
            searchParams: option?.query,
            headers: option?.headers,
            json: option?.body,
            form: option?.form,
            responseType: 'json',
          }),
        (e) => new HttpError(e as Error),
      ),
      TE.map((response) => new GotResponse(response)),
    );
  }
}
