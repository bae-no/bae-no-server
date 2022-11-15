import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { Message } from './vo/Message';

export interface ChatProps {
  userId: string;
  shareDealId: string;
  message: Message;
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

  get message(): Message {
    return this.props.message;
  }

  get content(): string {
    return this.message.content;
  }

  static of(props: ChatProps) {
    return new Chat(props);
  }

  static create(
    shareDealId: string,
    participantIds: string[],
    authorId: string,
    content: string,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        userId: id,
        message: Message.normal(authorId, content, authorId !== id),
      }),
    );
  }

  static createByStartShareDeal(
    shareDealId: string,
    participantIds: string[],
    authorId: string,
  ): Chat[] {
    return participantIds.map((id) =>
      Chat.of({
        shareDealId,
        userId: id,
        message: Message.startShareDealMessage(authorId),
      }),
    );
  }
}
