import { createHmac } from 'crypto';

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
    const path = `/sms/v2/services/${this.serviceId}/messages`;
    const timestamp = Date.now().toString();

    return pipe(
      this.makeSignature('POST', path, timestamp),
      (signature) =>
        this.httpClient.post(`${this.url}${path}`, {
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
      TE.bindTo('response'),
      TE.bind('body', ({ response }) => response.toEntity(SmsResponse)),
      TE.chainW(({ body, response }) =>
        body.isSuccessful
          ? TE.right(undefined)
          : TE.left(
              new Error(
                `SMS 발송이 실패했습니다: statusCode=${response.statusCode()} body=${JSON.stringify(
                  body,
                )}`,
              ),
            ),
      ),
      TE.mapLeft((err) => new NotificationError(err)),
    );
  }

  private makeSignature(
    method: string,
    path: string,
    timestamp: string,
  ): string {
    const space = ' ';
    const newLine = '\n';

    return createHmac('SHA256', this.secretKey)
      .update(method)
      .update(space)
      .update(path)
      .update(newLine)
      .update(timestamp)
      .update(newLine)
      .update(this.accessKey)
      .digest('base64');
  }
}
