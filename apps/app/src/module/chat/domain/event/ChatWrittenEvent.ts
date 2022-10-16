import { Chat } from '../Chat';

export class ChatWrittenEvent {
  static readonly EVENT_NAME = 'chat.written';

  constructor(private readonly chats: Chat[]) {}

  get payload(): Chat[] {
    return this.chats;
  }
}
