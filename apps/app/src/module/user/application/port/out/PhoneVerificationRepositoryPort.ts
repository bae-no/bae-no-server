import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { PhoneVerification } from '../../../domain/PhoneVerification';

export abstract class PhoneVerificationRepositoryPort {
  abstract save(
    userId: string,
    phoneVerification: PhoneVerification,
  ): TaskEither<DBError, PhoneVerification>;

  abstract findLatest(
    userId: string,
  ): TaskEither<DBError | NotFoundException, PhoneVerification>;
}
