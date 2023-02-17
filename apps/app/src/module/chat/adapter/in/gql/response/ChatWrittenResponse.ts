import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserId } from '../../../../../user/domain/User';
import type { Message } from '../../../../domain/vo/Message';
import { MessageType } from '../../../../domain/vo/MessageType';

@ObjectType()
export class ChatWrittenResponse {
  @Field(() => ID)
  authorId: UserId;

  @Field(() => MessageType)
  type: MessageType;

  @Field()
  content: string;

  static of(message: Message) {
    const response = new ChatWrittenResponse();

    response.authorId = message.authorId;
    response.type = message.type;
    response.content = message.content;

    return response;
  }
}
