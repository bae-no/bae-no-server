import { User } from '../../../../../user/domain/User';
import { Chat } from '../../../../domain/Chat';

export class FindByUserDto {
  constructor(readonly chat: Chat, readonly author: User) {}
}
