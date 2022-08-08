import { plainToInstance, Type } from 'class-transformer';

export class SmsResponse {
  private readonly response: SmsRootResponse;

  constructor(readonly body: string) {
    this.response = plainToInstance(SmsRootResponse, body);
  }

  get isSuccessful(): boolean {
    return !!this.response.header?.isSuccessful;
  }
}

export class SmsRootResponse {
  @Type(() => SmsHeaderResponse)
  header?: SmsHeaderResponse;
}

class SmsHeaderResponse {
  isSuccessful: boolean;
  resultCode: number;
  resultMessage: string;
}
