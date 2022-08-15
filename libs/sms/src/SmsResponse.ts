import { plainToInstance } from 'class-transformer';

export class SmsRootResponse {
  statusCode: string;
}

export class SmsResponse {
  private readonly response: SmsRootResponse;

  constructor(readonly body: string) {
    try {
      this.response = plainToInstance(SmsRootResponse, JSON.parse(body));
    } catch (e) {
      this.response = new SmsRootResponse();
    }
  }

  get isSuccessful(): boolean {
    return this.response.statusCode === '202';
  }
}
