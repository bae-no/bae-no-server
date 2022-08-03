import { HttpResponse } from '@app/domain/http/HttpResponse';
import { plainToInstance } from 'class-transformer';
import { Response } from 'got';

export class GotResponse implements HttpResponse {
  constructor(public readonly response: Response) {}

  isOk(): boolean {
    return this.response.ok;
  }

  statusCode(): number {
    return this.response.statusCode;
  }

  toEntity<T>(entity: { new (...args: any[]): T }): T {
    return plainToInstance(entity, this.response.body);
  }
}
