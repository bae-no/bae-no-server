import { DBError } from '@app/domain/error/DBError';
import { NotificationError } from '@app/domain/error/NotificationError';
import { TaskEither } from 'fp-ts/TaskEither';

import { SendPhoneVerificationCodeCommand } from './SendPhoneVerificationCodeCommand';

export abstract class PhoneVerificationUseCase {
  abstract sendCode(
    command: SendPhoneVerificationCodeCommand,
  ): TaskEither<DBError | NotificationError, void>;
}
