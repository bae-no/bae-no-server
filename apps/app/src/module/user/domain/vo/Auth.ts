import { AuthType } from './AuthType';

export class Auth {
  constructor(readonly socialId: string, readonly type: AuthType) {}
}
