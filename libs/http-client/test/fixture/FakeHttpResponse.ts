import { HttpError } from '@app/domain/error/HttpError';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { Either, right } from 'fp-ts/Either';

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

  get body(): string {
    return this._body;
  }

  get isOk(): boolean {
    return this._isOk;
  }

  get statusCode(): number {
    return this._statusCode;
  }

  static of<T>(params: FakeHttpResponseProps<T>) {
    return new FakeHttpResponse(
      params.isOk ?? true,
      params.statusCode ?? 200,
      params.body ?? '',
      params.entity ?? {},
    );
  }

  toEntity<T>(_entity: { new (...args: any[]): T }): Either<HttpError, T> {
    return right(this._entity as any);
  }
}
