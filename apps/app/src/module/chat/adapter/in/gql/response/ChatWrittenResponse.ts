import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Message } from '../../../../domain/vo/Message';
import { MessageType } from '../../../../domain/vo/MessageType';

@ObjectType()
export class ChatWrittenResponse {
  @Field(() => ID)
  authorId: string;

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
