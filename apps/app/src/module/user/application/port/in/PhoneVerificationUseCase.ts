import { DBError } from '@app/domain/error/DBError';
import { NotificationError } from '@app/domain/error/NotificationError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { SendPhoneVerificationCodeCommand } from './dto/SendPhoneVerificationCodeCommand';
import { VerifyPhoneVerificationCodeCommand } from './dto/VerifyPhoneVerificationCodeCommand';
import { ExpiredCodeException } from '../../../domain/exception/ExpiredCodeException';
import { MismatchedCodeException } from '../../../domain/exception/MismatchedCodeException';

export type VerifyPhoneVerificationCodeError =
  | DBError
  | NotFoundException
  | ExpiredCodeException
  | MismatchedCodeException;

export abstract class PhoneVerificationUseCase {
  abstract sendCode(
    command: SendPhoneVerificationCodeCommand,
  ): TaskEither<DBError | NotificationError, void>;

  abstract verify(
    command: VerifyPhoneVerificationCodeCommand,
  ): TaskEither<VerifyPhoneVerificationCodeError, void>;
}
