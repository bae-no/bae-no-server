import { createHmac } from 'crypto';

import { TE } from '@app/custom/fp-ts';
import { NotificationError } from '@app/domain/error/NotificationError';
import type { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { SmsResponse } from '@app/sms/SmsResponse';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

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
      TE.bind('body', ({ response }) =>
        TE.fromEither(response.toEntity(SmsResponse)),
      ),
      TE.chainW(({ body, response }) =>
        body.isSuccessful
          ? TE.right(undefined)
          : TE.left(
              new Error(
                `SMS 발송이 실패했습니다: statusCode=${response.statusCode} body=${response.body}`,
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
