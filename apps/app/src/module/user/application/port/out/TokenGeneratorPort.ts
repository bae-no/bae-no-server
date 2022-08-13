import { User } from '../../../domain/User';
import { AuthToken } from '../in/dto/AuthToken';

export abstract class TokenGeneratorPort {
  abstract generateByUser(user: User): AuthToken;
}
