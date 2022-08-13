import { DBError } from '@app/domain/error/DBError';
import { NotificationError } from '@app/domain/error/NotificationError';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { SendPhoneVerificationCodeCommand } from './dto/SendPhoneVerificationCodeCommand';
import { VerifyPhoneVerificationCodeCommand } from './dto/VerifyPhoneVerificationCodeCommand';

export type VerifyPhoneVerificationCodeError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export abstract class PhoneVerificationUseCase {
  abstract sendCode(
    command: SendPhoneVerificationCodeCommand,
  ): TaskEither<DBError | NotificationError, void>;

  abstract verify(
    command: VerifyPhoneVerificationCodeCommand,
  ): TaskEither<VerifyPhoneVerificationCodeError, void>;
}
