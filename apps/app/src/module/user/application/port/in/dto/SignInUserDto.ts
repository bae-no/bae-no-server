import { AuthToken } from './AuthToken';
import { User } from '../../../../domain/User';

export class SignInUserDto {
  constructor(
    readonly authToken: AuthToken,
    readonly user: User,
  ) {}
}
