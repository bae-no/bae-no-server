import type { Chat as OrmChat } from '@prisma/client';

import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import type { ChatId } from '../../../domain/Chat';
import { Chat } from '../../../domain/Chat';
import { Message } from '../../../domain/vo/Message';
import type { MessageType } from '../../../domain/vo/MessageType';

export class ChatOrmMapper {
  static toDomain(orm: OrmChat): Chat {
    return new Chat({
      userId: orm.userId as UserId,
      shareDealId: orm.shareDealId as ShareDealId,
      orderedKey: orm.orderedKey,
      message: Message.of(
        orm.message.authorId as UserId,
        orm.message.type as MessageType,
        orm.message.content,
        orm.message.unread,
      ),
    }).setBase(orm.id as ChatId, orm.createdAt, orm.updatedAt);
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
