import { T } from '@app/custom/effect';
import { HttpError } from '@app/domain/error/HttpError';
import type { HttpOption } from '@app/domain/http/HttpClientPort';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import type { HttpResponse } from '@app/domain/http/HttpResponse';
import type { HttpStatus } from '@nestjs/common';

import { FakeHttpResponse } from './FakeHttpResponse';

export class StubHttpClientService extends HttpClientPort {
  #responses: { status: number; body: unknown }[] = [];
  #errors: Error[] = [];
  #urls: string[] = [];
  #options: (HttpOption | undefined)[] = [];

  get urls(): string[] {
    return this.#urls;
  }

  get responses(): unknown[] {
    return this.#responses;
  }

  get errors(): Error[] {
    return this.#errors;
  }

  get options(): (HttpOption | undefined)[] {
    return this.#options;
  }

  clear() {
    this.#responses = [];
    this.#errors = [];
    this.#urls = [];
    this.#options = [];
  }

  addResponse(status: HttpStatus, body: unknown): this {
    this.#responses.push({ status, body });

    return this;
  }

  addError(error: Error): this {
    this.#errors.push(error);

    return this;
  }

  override delete(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse> {
    return this.send(url, option);
  }

  override get(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse> {
    return this.send(url, option);
  }

  override patch(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse> {
    return this.send(url, option);
  }

  override post(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse> {
    return this.send(url, option);
  }

  override put(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse> {
    return this.send(url, option);
  }

  private send(
    url: string,
    option?: HttpOption,
  ): T.IO<HttpError, HttpResponse> {
    this.#urls.push(url);
    this.#options.push(option);

    if (this.#errors.length) {
      return T.fail(new HttpError(this.#errors.shift() as Error));
    }

    if (!this.#responses.length) {
      throw new Error('response is empty');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { status, body } = this.#responses.shift()!;

    return T.succeed(
      FakeHttpResponse.of({
        isOk: 200 <= status && status < 300,
        statusCode: status,
        body: JSON.stringify(body),
        entity: body,
      }),
    );
  }
}
