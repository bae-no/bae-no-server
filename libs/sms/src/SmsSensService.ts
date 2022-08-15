import { NotificationError } from '@app/domain/error/NotificationError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { TE } from '@app/external/fp-ts';
import { SmsResponse } from '@app/sms/SmsResponse';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

@Injectable()
export class SmsSensService extends SmsPort {
  private readonly serviceId: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly sendNumber: string;
  private readonly url = 'https://sens.apigw.ntruss.com';

  constructor(
    private readonly httpClient: HttpClientPort,
    private readonly configService: ConfigService,
  ) {
    super();
    this.serviceId = this.configService.get('SMS_SERVICE_ID', '');
    this.accessKey = this.configService.get('SMS_ACCESS_KEY', '');
    this.secretKey = this.configService.get('SMS_SECRET_KEY', '');
    this.sendNumber = this.configService.get('SMS_SEND_NUMBER', '');
  }

  override send(
    phoneNumber: string,
    content: string,
  ): TaskEither<NotificationError, void> {
    const url = `${this.url}/sms/v2/services/${this.serviceId}/messages`;
    const timestamp = Date.now().toString();

    return pipe(
      this.makeSignature('POST', url, timestamp),
      (signature) =>
        this.httpClient.post(url, {
          headers: {
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': this.accessKey,
            'x-ncp-apigw-signature-v2': signature,
          },
          body: {
            type: 'SMS',
            from: this.sendNumber,
            content,
            messages: [{ to: phoneNumber }],
          },
        }),
      TE.map((res) => new SmsResponse(res.body())),
      TE.chainW((res) =>
        res.isSuccessful
          ? TE.right(undefined)
          : TE.left(new Error(`SMS 발송이 실패했습니다: body=${res.body}`)),
      ),
      TE.mapLeft((err) => new NotificationError(err)),
    );
  }

  private makeSignature(
    method: string,
    url: string,
    timestamp: string,
  ): string {
    const space = ' ';
    const newLine = '\n';
    const hmac = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      this.secretKey,
    );

    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(this.accessKey);

    const hash = hmac.finalize();

    return hash.toString(CryptoJS.enc.Base64);
  }
}
