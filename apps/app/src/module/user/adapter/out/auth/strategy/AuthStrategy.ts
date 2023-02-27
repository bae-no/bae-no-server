import type { T } from '@app/custom/effect';
import type { AuthError } from '@app/domain/error/AuthError';

import type { Auth } from '../../../../domain/vo/Auth';

export interface AuthStrategy {
  request(code: string): T.IO<AuthError, Auth>;
}
