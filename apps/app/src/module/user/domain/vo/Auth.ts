import { AuthType } from './AuthType';

export class Auth {
  constructor(
    readonly socialId: string,
    readonly type: AuthType,
  ) {}

  clear(): Auth {
    return new Auth('', this.type);
  }
}
