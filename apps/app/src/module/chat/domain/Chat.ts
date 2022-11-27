import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { Message } from './vo/Message';

export interface ChatProps {
  userId: string;
  shareDealId: string;
  message: Message;
  timestamp: number;
}

export class Chat extends BaseEntity<ChatProps> {
  constructor(props: ChatProps) {
    super(props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get shareDealId(): string {
    return this.props.shareDealId;
  }

  get timestamp(): number {
    return this.props.timestamp;
  }

  get message(): Message {
    return this.props.message;
  }

  get content(): string {
    return this.message.content;
  }

  get isAuthor(): boolean {
    return this.message.authorId === this.userId;
  }

  static of(props: ChatProps) {
    return new Chat(props);
  }

  static create(
    shareDealId: string,
    participantIds: string[],
    authorId: string,
    content: string,
    timestamp: number,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        timestamp,
        userId: id,
        message: Message.normal(authorId, content, authorId !== id),
      }),
    );
  }

  static createByStartShareDeal(
    shareDealId: string,
    participantIds: string[],
    authorId: string,
    timestamp: number,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        timestamp,
        userId: id,
        message: Message.startShareDealMessage(authorId),
      }),
    );
  }

  static createByEndShareDeal(
    shareDealId: string,
    participantIds: string[],
    authorId: string,
    timestamp: number,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        timestamp,
        userId: id,
        message: Message.endShareDealMessage(authorId),
      }),
    );
  }
}
