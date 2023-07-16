import type { AuthToken } from './AuthToken';
import type { User } from '../../../../domain/User';

export class SignInUserDto {
  constructor(
    readonly authToken: AuthToken,
    readonly user: User,
  ) {}
}
