import { T, O, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDBE } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';

import { ChatOrmMapper } from './ChatOrmMapper';
import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import type { FindChatByUserCommand } from '../../../application/port/in/dto/FindChatByUserCommand';
import { ChatQueryRepositoryPort } from '../../../application/port/out/ChatQueryRepositoryPort';
import type { Chat } from '../../../domain/Chat';

@Repository()
export class ChatQueryRepositoryAdapter extends ChatQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override last(
    shareDealId: ShareDealId,
    userId: UserId,
  ): T.IO<DBError, O.Option<Chat>> {
    return pipe(
      tryCatchDBE(() =>
        this.prisma.chat.findFirst({
          where: { shareDealId, userId },
          orderBy: { createdAt: 'desc' },
        }),
      ),
      T.map((chat) =>
        pipe(O.fromNullable(chat), O.map(ChatOrmMapper.toDomain)),
      ),
    );
  }

  override unreadCount(
    shareDealId: ShareDealId,
    userId: UserId,
  ): T.IO<DBError, number> {
    return pipe(
      tryCatchDBE(async () =>
        this.prisma.chat.count({
          where: {
            shareDealId,
            userId,
            message: { is: { unread: true } },
          },
        }),
      ),
    );
  }

  override findByUser(command: FindChatByUserCommand): T.IO<DBError, Chat[]> {
    return pipe(
      tryCatchDBE(async () =>
        this.prisma.chat.findMany({
          where: { shareDealId: command.shareDealId, userId: command.userId },
          ...(command.cursor ? { cursor: { orderedKey: command.cursor } } : {}),
          take: command.size,
          orderBy: { orderedKey: 'desc' },
        }),
      ),
      T.map((chats) => chats.map(ChatOrmMapper.toDomain)),
    );
  }
}
