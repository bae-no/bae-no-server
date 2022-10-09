import { HttpError } from '@app/domain/error/HttpError';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { plainToInstance } from 'class-transformer';
import { Either, tryCatch } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

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
      tryCatch(
        () => plainToInstance(entity, JSON.parse(this.rawBody)),
        (error) => new HttpError(error as Error),
      ),
    );
  }
}
