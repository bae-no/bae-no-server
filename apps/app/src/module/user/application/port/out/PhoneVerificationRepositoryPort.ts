import { DBError } from '@app/domain/error/DBError';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { PhoneVerification } from '../../../domain/PhoneVerification';

export abstract class PhoneVerificationRepositoryPort {
  abstract save(
    userId: string,
    phoneVerification: PhoneVerification,
  ): TaskEither<DBError, PhoneVerification>;

  abstract findLatest(
    userId: string,
  ): TaskEither<DBError, Option<PhoneVerification>>;
}
