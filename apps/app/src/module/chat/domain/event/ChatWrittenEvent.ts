import { Message } from '../vo/Message';

export class ChatWrittenEvent {
  constructor(
    private readonly shareDealId: string,
    private readonly message: Message,
  ) {}

  get key(): string {
    return `chat-written-${this.shareDealId}`;
  }

  get payload(): Message {
    return this.message;
  }
}
