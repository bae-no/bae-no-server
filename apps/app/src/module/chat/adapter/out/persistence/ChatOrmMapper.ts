import { Chat as OrmChat } from '@prisma/client';

import { Chat } from '../../../domain/Chat';
import { Message } from '../../../domain/vo/Message';
import { MessageType } from '../../../domain/vo/MessageType';

export class ChatOrmMapper {
  static toDomain(orm: OrmChat): Chat {
    return new Chat({
      userId: orm.userId,
      shareDealId: orm.shareDealId,
      message: Message.of(
        orm.message.authorId,
        orm.message.type as MessageType,
        orm.message.content,
      ),
    }).setBase(orm.id, orm.createdAt, orm.updatedAt);
  }

  static toOrm(domain: Chat): OrmChat {
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      userId: domain.userId,
      shareDealId: domain.shareDealId,
      message: {
        authorId: domain.message.authorId,
        type: domain.message.type,
        content: domain.message.content,
      },
    };
  }
}
