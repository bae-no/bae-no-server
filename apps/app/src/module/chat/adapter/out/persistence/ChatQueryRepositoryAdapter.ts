import { O, TE } from '@app/custom/fp-ts';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import type { Option } from 'fp-ts/Option';
import type { TaskEither } from 'fp-ts/TaskEither';

import { ChatOrmMapper } from './ChatOrmMapper';
import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import type { FindChatByUserCommand } from '../../../application/port/in/dto/FindChatByUserCommand';
import { ChatQueryRepositoryPort } from '../../../application/port/out/ChatQueryRepositoryPort';
import type { Chat } from '../../../domain/Chat';

@Injectable()
export class ChatQueryRepositoryAdapter extends ChatQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override last(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError, Option<Chat>> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.chat.findFirst({
          where: { shareDealId, userId },
          orderBy: { createdAt: 'desc' },
        }),
      ),
      TE.map((chat) =>
        pipe(O.fromNullable(chat), O.map(ChatOrmMapper.toDomain)),
      ),
    );
  }

  override unreadCount(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError, number> {
    return pipe(
      tryCatchDB(async () =>
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

  override findByUser(
    command: FindChatByUserCommand,
  ): TaskEither<DBError, Chat[]> {
    return pipe(
      tryCatchDB(async () =>
        this.prisma.chat.findMany({
          where: { shareDealId: command.shareDealId, userId: command.userId },
          ...(command.cursor ? { cursor: { orderedKey: command.cursor } } : {}),
          take: command.size,
          orderBy: { orderedKey: 'desc' },
        }),
      ),
      TE.map((chats) => chats.map(ChatOrmMapper.toDomain)),
    );
  }
}
