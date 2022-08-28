import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { Message } from './vo/Message';

export interface CreateChatProps {
  shareDealId: string;
}

export interface ChatProps extends CreateChatProps {
  messages: Message[];
}

export class Chat extends BaseEntity<ChatProps> {
  private constructor(props: ChatProps) {
    super(props);
  }

  static of(props: CreateChatProps) {
    return new Chat({ ...props, messages: [] });
  }
}
