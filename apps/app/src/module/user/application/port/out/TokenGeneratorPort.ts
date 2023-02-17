import type { User } from '../../../domain/User';
import type { AuthToken } from '../in/dto/AuthToken';

export abstract class TokenGeneratorPort {
  abstract generateByUser(user: User): AuthToken;
}
