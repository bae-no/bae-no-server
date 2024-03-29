import { E, pipe } from '@app/custom/effect';
import { HttpError } from '@app/domain/error/HttpError';
import type { HttpResponse } from '@app/domain/http/HttpResponse';
import { plainToInstance } from 'class-transformer';

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

  toEntity<T>(entity: new (...args: any[]) => T): E.Either<HttpError, T> {
    return pipe(
      E.parseJSON((v) => v)(this.rawBody),
      E.chain((body) =>
        E.tryCatch(
          () => plainToInstance(entity, body),
          (v) => v,
        ),
      ),
      E.mapLeft((error) => new HttpError(E.toError(error))),
    );
  }
}
