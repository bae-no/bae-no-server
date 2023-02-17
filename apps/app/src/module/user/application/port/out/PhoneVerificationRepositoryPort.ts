import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { PhoneVerification } from '../../../domain/PhoneVerification';
import type { UserId } from '../../../domain/User';

export abstract class PhoneVerificationRepositoryPort {
  abstract save(
    userId: UserId,
    phoneVerification: PhoneVerification,
  ): TaskEither<DBError, PhoneVerification>;

  abstract findLatest(
    userId: UserId,
  ): TaskEither<DBError | NotFoundException, PhoneVerification>;
}
