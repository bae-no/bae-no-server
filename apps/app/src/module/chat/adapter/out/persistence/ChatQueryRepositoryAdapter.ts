import { O, TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { FindChatByUserCommand } from '../../../application/port/in/dto/FindChatByUserCommand';
import { ChatQueryRepositoryPort } from '../../../application/port/out/ChatQueryRepositoryPort';
import { Chat } from '../../../domain/Chat';
import { ChatOrmMapper } from './ChatOrmMapper';

@Injectable()
export class ChatQueryRepositoryAdapter extends ChatQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override last(
    shareDealId: string,
    userId: string,
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
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError, number> {
    return pipe(
      tryCatchDB(() =>
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
      tryCatchDB(() =>
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
