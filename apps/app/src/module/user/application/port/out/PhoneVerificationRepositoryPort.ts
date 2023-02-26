import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';

import type { PhoneVerification } from '../../../domain/PhoneVerification';
import type { UserId } from '../../../domain/User';

export abstract class PhoneVerificationRepositoryPort {
  abstract save(
    userId: UserId,
    phoneVerification: PhoneVerification,
  ): T.IO<DBError, PhoneVerification>;

  abstract findLatest(
    userId: UserId,
  ): T.IO<DBError | NotFoundException, PhoneVerification>;
}
