import { Chat } from '../Chat';

export class ChatWrittenEvent {
  static readonly EVENT_NAME = 'chat.written';

  constructor(readonly chats: Chat[]) {}

  get chatsWithoutAuthor(): Chat[] {
    return this.chats.filter((chat) => !chat.isAuthor);
  }
}
