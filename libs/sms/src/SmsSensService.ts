import { createHmac } from 'crypto';

import { T, pipe } from '@app/custom/effect';
import { NotificationError } from '@app/domain/error/NotificationError';
import type { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { SmsResponse } from '@app/sms/SmsResponse';

export class SmsSensService extends SmsPort {
  constructor(
    private readonly httpClient: HttpClientPort,
    private readonly serviceId: string,
    private readonly accessKey: string,
    private readonly secretKey: string,
    private readonly sendNumber: string,
    private readonly url = 'https://sens.apigw.ntruss.com',
  ) {
    super();
  }

  override send(
    phoneNumber: string,
    content: string,
  ): T.IO<NotificationError, void> {
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
      T.chain((response) =>
        T.structPar({
          response: T.succeed(response),
          body: T.fromEither(() => response.toEntity(SmsResponse)),
        }),
      ),
      T.chain(({ body, response }) =>
        body.isSuccessful
          ? T.succeed(undefined)
          : T.fail(
              new Error(
                `SMS 발송이 실패했습니다: statusCode=${response.statusCode} body=${response.body}`,
              ),
            ),
      ),
      T.mapError((err) => new NotificationError(err)),
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
