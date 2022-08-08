import { HttpResponse } from '@app/domain/http/HttpResponse';

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

  body(): string {
    return this._body;
  }

  isOk(): boolean {
    return this._isOk;
  }

  statusCode(): number {
    return this._statusCode;
  }

  toEntity<T>(_entity: { new (...args: any[]): T }): T {
    return this._entity as any;
  }

  static of<T>(params: FakeHttpResponseProps<T>) {
    return new FakeHttpResponse(
      params.isOk ?? true,
      params.statusCode ?? 200,
      params.body ?? '',
      params.entity ?? {},
    );
  }
}
