import { plainToInstance, Type } from 'class-transformer';

class SmsHeaderResponse {
  isSuccessful: boolean;
  resultCode: number;
  resultMessage: string;
}

export class SmsRootResponse {
  @Type(() => SmsHeaderResponse)
  header?: SmsHeaderResponse;
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
    return !!this.response.header?.isSuccessful;
  }
}
