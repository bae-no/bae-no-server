import { HttpError } from '@app/domain/error/HttpError';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { TE } from '@app/external/fp-ts';
import { plainToInstance } from 'class-transformer';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

export class NodeFetchResponse implements HttpResponse {
  constructor(public readonly response: Response) {}

  isOk(): boolean {
    return this.response.ok;
  }

  statusCode(): number {
    return this.response.status;
  }

  toEntity<T>(entity: { new (...args: any[]): T }): TaskEither<HttpError, T> {
    return pipe(
      TE.tryCatch(
        async () => plainToInstance(entity, await this.response.json()),
        (error) => new HttpError(error as Error),
      ),
    );
  }

  body(): TaskEither<HttpError, string> {
    return pipe(
      TE.tryCatch(
        async () => this.response.text(),
        (error) => new HttpError(error as Error),
      ),
    );
  }
}
