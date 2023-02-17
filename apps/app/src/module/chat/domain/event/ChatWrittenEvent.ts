import { DomainEvent } from '@app/domain/event/DomainEvent';

import type { Chat } from '../Chat';

export class ChatWrittenEvent extends DomainEvent {
  constructor(readonly chats: Chat[]) {
    super();
  }

  get chatsWithoutAuthor(): Chat[] {
    return this.chats.filter((chat) => !chat.isAuthor);
  }
}
