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

  static of(props: ChatProps) {
    return new Chat(props);
  }
}
