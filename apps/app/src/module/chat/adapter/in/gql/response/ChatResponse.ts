import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import type { FindChatResult } from '../../../../application/port/in/dto/FindChatResult';

@ObjectType()
export class ChatResponse {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  thumbnail: string;

  @Field()
  lastContent: string;

  @Field(() => Int)
  unreadCount: number;

  static of(result: FindChatResult): ChatResponse {
    const response = new ChatResponse();

    response.id = result.id;
    response.title = result.title;
    response.thumbnail = result.thumbnail;
    response.lastContent = result.lastContent;
    response.unreadCount = result.unreadCount;

    return response;
  }
}
