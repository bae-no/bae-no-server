import type { T } from '@app/custom/effect';
import type { AuthError } from '@app/domain/error/AuthError';

import type { Auth } from '../../../domain/vo/Auth';
import type { AuthType } from '../../../domain/vo/AuthType';

export abstract class AuthProviderPort {
  abstract findOne(code: string, type: AuthType): T.IO<AuthError, Auth>;
}
