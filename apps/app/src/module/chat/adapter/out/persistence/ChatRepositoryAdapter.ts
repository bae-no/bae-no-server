import { T, pipe, constVoid } from '@app/custom/effect';
import { TE } from '@app/custom/fp-ts';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB, tryCatchDBE } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import type { TaskEither } from 'fp-ts/TaskEither';

import { ChatOrmMapper } from './ChatOrmMapper';
import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import { ChatRepositoryPort } from '../../../application/port/out/ChatRepositoryPort';
import type { Chat } from '../../../domain/Chat';

@Repository()
export class ChatRepositoryAdapter extends ChatRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override create(chats: Chat[]): TaskEither<DBError, Chat[]> {
    return pipe(
      chats.map((chat) => ChatOrmMapper.toOrm(chat)),
      (chats) =>
        tryCatchDB(async () =>
          this.prisma.$transaction(
            chats.map((data) => this.prisma.chat.create({ data })),
          ),
        ),
      TE.map((chats) => chats.map(ChatOrmMapper.toDomain)),
    );
  }

  override updateRead(
    shareDealId: ShareDealId,
    userId: UserId,
  ): T.IO<DBError, void> {
    return pipe(
      tryCatchDBE(async () =>
        this.prisma.chat.updateMany({
          where: { shareDealId, userId },
          data: { message: { update: { unread: false } } },
        }),
      ),
      T.map(constVoid),
    );
  }
}
