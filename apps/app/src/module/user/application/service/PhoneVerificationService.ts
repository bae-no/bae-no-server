import { T } from '@app/custom/effect';
import { pipe, constVoid } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';
import type { NotificationError } from '@app/domain/error/NotificationError';
import { SmsPort } from '@app/domain/notification/SmsPort';

import { PhoneVerification } from '../../domain/PhoneVerification';
import type { SendPhoneVerificationCodeCommand } from '../port/in/dto/SendPhoneVerificationCodeCommand';
import type { VerifyPhoneVerificationCodeCommand } from '../port/in/dto/VerifyPhoneVerificationCodeCommand';
import type { VerifyPhoneVerificationCodeError } from '../port/in/PhoneVerificationUseCase';
import { PhoneVerificationUseCase } from '../port/in/PhoneVerificationUseCase';
import { PhoneVerificationRepositoryPort } from '../port/out/PhoneVerificationRepositoryPort';
import { UserQueryRepositoryPort } from '../port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from '../port/out/UserRepositoryPort';

@Service()
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
  ): T.IO<DBError | NotificationError, void> {
    return pipe(
      this.phoneVerificationRepositoryPort.save(
        command.userId,
        PhoneVerification.of(command.phoneNumber),
      ),
      T.chain((verification) =>
        this.smsPort.send(verification.phoneNumber, verification.code),
      ),
    );
  }

  override verify(
    command: VerifyPhoneVerificationCodeCommand,
  ): T.IO<VerifyPhoneVerificationCodeError, void> {
    return pipe(
      T.structPar({
        verification: this.phoneVerificationRepositoryPort.findLatest(
          command.userId,
        ),
        user: this.userQueryRepositoryPort.findByIdE(command.userId),
      }),
      T.chain(({ verification, user }) =>
        T.fromEither(() =>
          user.updateByPhoneVerification(verification, command.code),
        ),
      ),
      T.chain((user) => this.userRepositoryPort.save(user)),
      T.map(constVoid),
    );
  }
}
