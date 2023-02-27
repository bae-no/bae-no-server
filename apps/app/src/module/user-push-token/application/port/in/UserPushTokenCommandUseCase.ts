import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { UpdateUserPushTokenCommand } from './dto/UpdateUserPushTokenCommand';

export abstract class UserPushTokenCommandUseCase {
  abstract update(command: UpdateUserPushTokenCommand): T.IO<DBError, void>;
}
