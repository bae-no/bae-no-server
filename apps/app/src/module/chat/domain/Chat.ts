import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { Message } from './vo/Message';
import { UserId } from '../../user/domain/User';

export interface ChatProps {
  userId: UserId;
  shareDealId: string;
  message: Message;
  orderedKey: string;
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

  get orderedKey(): string {
    return this.props.orderedKey;
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
    participantIds: UserId[],
    authorId: UserId,
    content: string,
    orderedKey: string,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        orderedKey,
        userId: id,
        message: Message.normal(authorId, content, authorId !== id),
      }),
    );
  }

  static createByStartShareDeal(
    shareDealId: string,
    participantIds: UserId[],
    authorId: UserId,
    orderedKey: string,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        orderedKey,
        userId: id,
        message: Message.startShareDealMessage(authorId),
      }),
    );
  }

  static createByEndShareDeal(
    shareDealId: string,
    participantIds: UserId[],
    authorId: UserId,
    orderedKey: string,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        orderedKey,
        userId: id,
        message: Message.endShareDealMessage(authorId),
      }),
    );
  }

  static createByCloseShareDeal(
    shareDealId: string,
    participantIds: UserId[],
    authorId: UserId,
    orderedKey: string,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        orderedKey,
        userId: id,
        message: Message.closeShareDealMessage(authorId),
      }),
    );
  }
}
