import { HttpError } from '@app/domain/error/HttpError';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { TE } from '@app/external/fp-ts';
import { TaskEither } from 'fp-ts/TaskEither';

type FakeHttpResponseProps<T> = {
  isOk?: boolean;
  statusCode?: number;
  body?: string;
  entity?: T;
};

export class FakeHttpResponse<T> implements HttpResponse {
  private constructor(
    private readonly _isOk: boolean,
    private readonly _statusCode: number,
    private readonly _body: string,
    private readonly _entity: T,
  ) {}

  static of<T>(params: FakeHttpResponseProps<T>) {
    return new FakeHttpResponse(
      params.isOk ?? true,
      params.statusCode ?? 200,
      params.body ?? '',
      params.entity ?? {},
    );
  }

  body(): TaskEither<HttpError, string> {
    return TE.right(this._body);
  }

  isOk(): boolean {
    return this._isOk;
  }

  statusCode(): number {
    return this._statusCode;
  }

  toEntity<T>(_entity: { new (...args: any[]): T }): TaskEither<HttpError, T> {
    return TE.right(this._entity as any);
  }
}
