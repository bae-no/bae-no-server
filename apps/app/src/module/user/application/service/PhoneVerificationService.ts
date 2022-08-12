import { DBError } from '@app/domain/error/DBError';
import { NotificationError } from '@app/domain/error/NotificationError';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { TE } from '@app/external/fp-ts';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { PhoneVerification } from '../../domain/PhoneVerification';
import { PhoneVerificationUseCase } from '../port/in/PhoneVerificationUseCase';
import { SendPhoneVerificationCodeCommand } from '../port/in/SendPhoneVerificationCodeCommand';
import { PhoneVerificationRepositoryPort } from '../port/out/PhoneVerificationRepositoryPort';

@Injectable()
export class PhoneVerificationService extends PhoneVerificationUseCase {
  constructor(
    private readonly phoneVerificationRepositoryPort: PhoneVerificationRepositoryPort,
    private readonly smsPort: SmsPort,
  ) {
    super();
  }

  override sendCode(
    command: SendPhoneVerificationCodeCommand,
  ): TaskEither<DBError | NotificationError, void> {
    return pipe(
      this.phoneVerificationRepositoryPort.save(
        command.id,
        PhoneVerification.of(command.phoneNumber),
      ),
      TE.chainW((verification) =>
        this.smsPort.send(verification.phoneNumber, verification.code),
      ),
    );
  }
}
