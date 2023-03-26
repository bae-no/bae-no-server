import { Field, ID, ObjectType } from '@nestjs/graphql';

import type { UserId } from '../../../../../user/domain/User';
import type { FindByUserDto } from '../../../../application/port/in/dto/FindByUserDto';
import { MessageType } from '../../../../domain/vo/MessageType';

@ObjectType()
export class ChatDetailResponse {
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

  static of(dto: FindByUserDto, userId: UserId): ChatDetailResponse {
    const response = new ChatDetailResponse();

    response.id = dto.chat.id;
    response.createdAt = dto.chat.createdAt;
    response.type = dto.chat.message.type;
    response.content = dto.chat.message.content;
    response.authorName = dto.author.nickname;
    response.writtenByMe = dto.author.id === userId;

    return response;
  }
}
