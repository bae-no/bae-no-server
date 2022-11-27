export class ChatReadEvent {
  static readonly EVENT_NAME = 'chat.read';

  constructor(readonly userId: string, readonly shareDealId: string) {}
}
