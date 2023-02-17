import { TE } from '@app/custom/fp-ts';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

import { ChatOrmMapper } from './ChatOrmMapper';
import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import { ChatRepositoryPort } from '../../../application/port/out/ChatRepositoryPort';
import type { Chat } from '../../../domain/Chat';

@Injectable()
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
  ): TaskEither<DBError, void> {
    return pipe(
      tryCatchDB(async () =>
        this.prisma.chat.updateMany({
          where: { shareDealId, userId },
          data: { message: { update: { unread: false } } },
        }),
      ),
      TE.map(constVoid),
    );
  }
}
