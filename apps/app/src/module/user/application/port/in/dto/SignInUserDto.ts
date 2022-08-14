import { User } from '../../../../domain/User';
import { AuthToken } from './AuthToken';

export class SignInUserDto {
  constructor(readonly authToken: AuthToken, readonly user: User) {}
}
