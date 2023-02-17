import type { User } from '../../../../../user/domain/User';
import type { Chat } from '../../../../domain/Chat';

export class FindByUserDto {
  constructor(readonly chat: Chat, readonly author: User) {}
}
