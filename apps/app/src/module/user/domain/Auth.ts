import { AuthType } from './AuthType';

class Auth {
  constructor(readonly socialId: string, readonly type: AuthType) {}
}
