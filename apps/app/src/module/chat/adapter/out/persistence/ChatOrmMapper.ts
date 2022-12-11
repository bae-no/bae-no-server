import { Chat as OrmChat } from '@prisma/client';

import { Chat } from '../../../domain/Chat';
import { Message } from '../../../domain/vo/Message';
import { MessageType } from '../../../domain/vo/MessageType';

export class ChatOrmMapper {
  static toDomain(orm: OrmChat): Chat {
    return new Chat({
      userId: orm.userId,
      shareDealId: orm.shareDealId,
      orderedKey: orm.orderedKey,
      message: Message.of(
        orm.message.authorId,
        orm.message.type as MessageType,
        orm.message.content,
        orm.message.unread,
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
      orderedKey: domain.orderedKey,
      message: {
        authorId: domain.message.authorId,
        type: domain.message.type,
        content: domain.message.content,
        unread: domain.message.unread,
      },
    };
  }
}
