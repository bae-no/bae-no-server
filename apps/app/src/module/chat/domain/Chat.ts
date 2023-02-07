import { BaseBrandedEntity } from '@app/domain/entity/BaseBrandedEntity';
import { Branded } from '@app/domain/entity/Branded';

import { Message } from './vo/Message';
import { ShareDealId } from '../../share-deal/domain/ShareDeal';
import { UserId } from '../../user/domain/User';

export interface ChatProps {
  userId: UserId;
  shareDealId: ShareDealId;
  message: Message;
  orderedKey: string;
}

export type ChatId = Branded<string, 'ChatId'>;

export function ChatId(id: string): ChatId {
  return id as ChatId;
}

export class Chat extends BaseBrandedEntity<ChatProps, ChatId> {
  constructor(props: ChatProps) {
    super(props);
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get shareDealId(): ShareDealId {
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
    shareDealId: ShareDealId,
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
    shareDealId: ShareDealId,
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
    shareDealId: ShareDealId,
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
    shareDealId: ShareDealId,
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
