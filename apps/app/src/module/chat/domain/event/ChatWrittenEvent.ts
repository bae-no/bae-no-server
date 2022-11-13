import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';

import { Chat } from '../Chat';

export class ChatWrittenEvent {
  static readonly EVENT_NAME = 'chat.written';

  constructor(private readonly chat: ReadonlyNonEmptyArray<Chat>) {}

  get payload(): ReadonlyNonEmptyArray<Chat> {
    return this.chat;
  }
}
