import { Chat } from '../Chat';

export class ChatWrittenEvent {
  static readonly EVENT_NAME = 'chat.written';

  constructor(private readonly chat: Chat) {}

  get payload(): Chat {
    return this.chat;
  }
}
