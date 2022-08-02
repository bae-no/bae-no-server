import { User } from '../../../domain/User';
import { AuthToken } from '../in/AuthToken';

export interface TokenGeneratorPort {
  generateByUser(user: User): AuthToken;
}
