import { E, Json } from '@app/custom/fp-ts';
import { HttpError } from '@app/domain/error/HttpError';
import type { HttpResponse } from '@app/domain/http/HttpResponse';
import { plainToInstance } from 'class-transformer';
import type { Either } from 'fp-ts/Either';
import { tryCatch } from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';

export class NodeFetchResponse implements HttpResponse {
  constructor(private status: number, private rawBody: string) {}

  get isOk(): boolean {
    return 200 <= this.status && this.status < 300;
  }

  get statusCode(): number {
    return this.status;
  }

  get body(): string {
    return this.rawBody;
  }

  toEntity<T>(entity: { new (...args: any[]): T }): Either<HttpError, T> {
    return pipe(
      Json.parse(this.rawBody),
      E.chain((body) =>
        tryCatch(() => plainToInstance(entity, body), identity),
      ),
      E.mapLeft((error) => new HttpError(error as Error)),
    );
  }
}
