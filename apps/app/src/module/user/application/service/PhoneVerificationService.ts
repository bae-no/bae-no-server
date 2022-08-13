import { DBError } from '@app/domain/error/DBError';
import { NotificationError } from '@app/domain/error/NotificationError';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { TE } from '@app/external/fp-ts';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { PhoneVerification } from '../../domain/PhoneVerification';
import {
  PhoneVerificationUseCase,
  VerifyPhoneVerificationCodeError,
} from '../port/in/PhoneVerificationUseCase';
import { SendPhoneVerificationCodeCommand } from '../port/in/SendPhoneVerificationCodeCommand';
import { VerifyPhoneVerificationCodeCommand } from '../port/in/VerifyPhoneVerificationCodeCommand';
import { PhoneVerificationRepositoryPort } from '../port/out/PhoneVerificationRepositoryPort';
import { UserQueryRepositoryPort } from '../port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from '../port/out/UserRepositoryPort';

@Injectable()
export class PhoneVerificationService extends PhoneVerificationUseCase {
  constructor(
    private readonly phoneVerificationRepositoryPort: PhoneVerificationRepositoryPort,
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
    private readonly userRepositoryPort: UserRepositoryPort,
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

  override verify(
    command: VerifyPhoneVerificationCodeCommand,
  ): TaskEither<VerifyPhoneVerificationCodeError, void> {
    return pipe(
      TE.Do,
      TE.apS(
        'verification',
        this.phoneVerificationRepositoryPort.findLatest(command.userId),
      ),
      TE.apS('user', this.userQueryRepositoryPort.findById(command.userId)),
      TE.chainEitherKW(({ verification, user }) =>
        user.updateByPhoneVerification(verification, command.code),
      ),
      TE.chain((user) => this.userRepositoryPort.save(user)),
      TE.map(constVoid),
    );
  }
}
