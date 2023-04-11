import { Field, ID, ObjectType } from '@nestjs/graphql';

import type { User } from '../../../../../user/domain/User';
import type { Chat } from '../../../../domain/Chat';
import { MessageType } from '../../../../domain/vo/MessageType';

@ObjectType()
export class ChatWrittenResponse {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => MessageType)
  type: MessageType;

  @Field()
  authorName: string;

  @Field()
  content: string;

  @Field({ description: '내가 쓴 글인지 여부' })
  writtenByMe: boolean;

  @Field()
  orderedKey: string;

  @Field()
  unread: boolean;

  static of(chat: Chat, author: User) {
    const response = new ChatWrittenResponse();

    response.id = chat.id;
    response.createdAt = chat.createdAt;
    response.type = chat.message.type;
    response.content = chat.message.content;
    response.authorName = author.nickname;
    response.orderedKey = chat.orderedKey;
    response.unread = chat.message.unread;

    return response;
  }
}
