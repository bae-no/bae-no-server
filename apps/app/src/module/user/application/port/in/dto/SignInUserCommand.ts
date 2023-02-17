import type { AuthType } from '../../../../domain/vo/AuthType';

export class SignInUserCommand {
  constructor(readonly code: string, readonly type: AuthType) {}
}
