import { AuthType } from '../../../domain/AuthType';

export class SignInUserCommand {
  constructor(readonly code: string, readonly type: AuthType) {}
}
