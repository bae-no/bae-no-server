import { NotificationError } from '@app/domain/error/NotificationError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { TE } from '@app/external/fp-ts';
import { SmsResponse } from '@app/sms/SmsResponse';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

@Injectable()
export class SmsToastService extends SmsPort {
  private readonly appKey: string;
  private readonly secretKey: string;
  private readonly sendNumber: string;
  private readonly url = 'https://api-sms.cloud.toast.com';

  constructor(
    private readonly httpClient: HttpClientPort,
    private readonly configService: ConfigService,
  ) {
    super();
    this.appKey = this.configService.get('SMS_APP_KEY', '');
    this.secretKey = this.configService.get('SMS_APP_SECRET', '');
    this.sendNumber = this.configService.get('SMS_SEND_NUMBER', '');
  }

  override send(
    phoneNumber: string,
    content: string,
  ): TaskEither<NotificationError, void> {
    return pipe(
      this.httpClient.post(
        `${this.url}/sms/v3.0/appKeys/${this.appKey}/sender/sms`,
        {
          headers: { 'X-Secret-Key': this.secretKey },
          body: {
            body: content,
            sendNo: this.sendNumber,
            recipientList: [{ recipientNo: phoneNumber }],
          },
        },
      ),
      TE.map((res) => new SmsResponse(res.body())),
      TE.chainW((res) =>
        res.isSuccessful
          ? TE.right(undefined)
          : TE.left(new Error(`SMS 발송이 실패했습니다: body=${res.body}`)),
      ),
      TE.mapLeft((err) => new NotificationError(err)),
    );
  }
}
