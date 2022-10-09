import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { Message } from './vo/Message';

export interface ChatProps {
  userId: string;
  shareDealId: string;
  messages: Message;
}

export class Chat extends BaseEntity<ChatProps> {
  private constructor(props: ChatProps) {
    super(props);
  }

  static of(props: ChatProps) {
    return new Chat(props);
  }
}
