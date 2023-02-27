import { O, pipe } from '@app/custom/effect';
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

  @Field()
  lastUpdatedAt: Date;

  @Field(() => Int)
  unreadCount: number;

  static of(result: FindChatResult): ChatResponse {
    const response = new ChatResponse();

    response.id = result.id;
    response.title = result.title;
    response.thumbnail = result.thumbnail;
    response.lastContent = pipe(
      result.lastChat,
      O.map((chat) => chat.content),
      O.getOrElse(() => ''),
    );
    response.lastUpdatedAt = pipe(
      result.lastChat,
      O.map((chat) => chat.createdAt),
      O.getOrElse(() => new Date()),
    );
    response.unreadCount = result.unreadCount;

    return response;
  }
}
