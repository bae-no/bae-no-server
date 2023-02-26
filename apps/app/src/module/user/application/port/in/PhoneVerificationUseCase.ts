import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotificationError } from '@app/domain/error/NotificationError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';

import type { SendPhoneVerificationCodeCommand } from './dto/SendPhoneVerificationCodeCommand';
import type { VerifyPhoneVerificationCodeCommand } from './dto/VerifyPhoneVerificationCodeCommand';
import type { ExpiredCodeException } from '../../../domain/exception/ExpiredCodeException';
import type { MismatchedCodeException } from '../../../domain/exception/MismatchedCodeException';

export type VerifyPhoneVerificationCodeError =
  | DBError
  | NotFoundException
  | ExpiredCodeException
  | MismatchedCodeException;

export abstract class PhoneVerificationUseCase {
  abstract sendCode(
    command: SendPhoneVerificationCodeCommand,
  ): T.IO<DBError | NotificationError, void>;

  abstract verify(
    command: VerifyPhoneVerificationCodeCommand,
  ): T.IO<VerifyPhoneVerificationCodeError, void>;
}
