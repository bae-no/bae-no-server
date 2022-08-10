import { NotificationError } from '@app/domain/error/NotificationError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { SendPhoneVerificationCodeCommand } from './SendPhoneVerificationCodeCommand';

export abstract class PhoneVerificationUseCase {
  abstract sendCode(
    command: SendPhoneVerificationCodeCommand,
  ): TaskEither<NotFoundException | NotificationError, void>;
}
