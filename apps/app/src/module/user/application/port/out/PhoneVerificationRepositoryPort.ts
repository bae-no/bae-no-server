import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { PhoneVerification } from '../../../domain/PhoneVerification';
import { UserId } from '../../../domain/User';

export abstract class PhoneVerificationRepositoryPort {
  abstract save(
    userId: UserId,
    phoneVerification: PhoneVerification,
  ): TaskEither<DBError, PhoneVerification>;

  abstract findLatest(
    userId: UserId,
  ): TaskEither<DBError | NotFoundException, PhoneVerification>;
}
