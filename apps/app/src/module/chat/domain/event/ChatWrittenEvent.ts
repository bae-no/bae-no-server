import { Chat } from '../Chat';

export class ChatWrittenEvent {
  static readonly EVENT_NAME = 'chat.written';

  constructor(readonly chats: Chat[]) {}
}
