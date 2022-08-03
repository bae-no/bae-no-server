import { HttpError } from '@app/domain/error/HttpError';
import { TE } from '@app/domain/fp-ts';
import { HttpClientPort, HttpOption } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { GotResponse } from '@app/http-client/GotResponse';
import { Injectable } from '@nestjs/common';
import { toError } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';
import got from 'got';

@Injectable()
export class HttpClientService implements HttpClientPort {
  private readonly instance = got.extend({
    timeout: {
      connect: 5000,
      request: 10000,
    },
  });

  get(url: string, option?: HttpOption): TaskEither<HttpError, HttpResponse> {
    return pipe(
      TE.tryCatch(
        async () =>
          this.instance.get(url, {
            searchParams: option?.query,
            headers: option?.headers,
            json: option?.body,
            responseType: 'json',
          }),
        (e) => new HttpError(toError(e)),
      ),
      TE.map((response) => new GotResponse(response)),
    );
  }
}
