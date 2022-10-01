import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { FindShareDealCommand } from '../../../application/port/out/dto/FindShareDealCommand';
import { ShareDealSortType } from '../../../application/port/out/dto/ShareDealSortType';
import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import { ShareDeal } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
import { ShareDealOrmMapper } from './ShareDealOrmMapper';

@Injectable()
export class ShareDealQueryRepositoryAdapter extends ShareDealQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override find(
    command: FindShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]> {
    const args: Prisma.ShareDealFindManyArgs = {
      skip: command.skip,
      take: command.size,
      where: { status: { in: [ShareDealStatus.OPEN, ShareDealStatus.START] } },
    };

    if (command.keyword) {
      args.where = { ...args.where, title: { contains: command.keyword } };
    }

    if (command.category) {
      args.where = { ...args.where, category: command.category };
    }

    if (command.sortType === ShareDealSortType.LATEST) {
      args.orderBy = { createdAt: Prisma.SortOrder.desc };
    }

    if (command.sortType === ShareDealSortType.POPULAR) {
      args.orderBy = { participants: { current: Prisma.SortOrder.desc } };
    }

    if (command.sortType === ShareDealSortType.PARTICIPANTS) {
      args.orderBy = { participants: { remaining: Prisma.SortOrder.desc } };
    }

    return pipe(
      tryCatchDB(() => this.prisma.shareDeal.findMany(args)),
      TE.map((deals) => deals.map(ShareDealOrmMapper.toDomain)),
    );
  }

  override countByStatus(
    userId: string,
    status: ShareDealStatus,
  ): TaskEither<DBError, number> {
    return tryCatchDB(() =>
      this.prisma.shareDeal.count({
        where: { status, participants: { is: { ids: { hasSome: [userId] } } } },
      }),
    );
  }
}
