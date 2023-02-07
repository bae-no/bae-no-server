import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { Prisma, ShareDeal as OrmShareDeal } from '@prisma/client';
import { pipe, unsafeCoerce } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealOrmMapper } from './ShareDealOrmMapper';
import { UserId } from '../../../../user/domain/User';
import { CountShareDealCommand } from '../../../application/port/out/dto/CountShareDealCommand';
import { FindByUserShareDealCommand } from '../../../application/port/out/dto/FindByUserShareDealCommand';
import { FindShareDealByNearestCommand } from '../../../application/port/out/dto/FindShareDealByNearestCommand';
import { FindShareDealCommand } from '../../../application/port/out/dto/FindShareDealCommand';
import { ShareDealSortType } from '../../../application/port/out/dto/ShareDealSortType';
import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import { ShareDeal } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';

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
      tryCatchDB(async () => this.prisma.shareDeal.findMany(args)),
      TE.map((deals) => deals.map(ShareDealOrmMapper.toDomain)),
    );
  }

  override count(command: CountShareDealCommand): TaskEither<DBError, number> {
    const args: Prisma.ShareDealCountArgs = {
      where: { status: { in: [ShareDealStatus.OPEN, ShareDealStatus.START] } },
    };

    if (command.keyword) {
      args.where = { ...args.where, title: { contains: command.keyword } };
    }

    if (command.category) {
      args.where = { ...args.where, category: command.category };
    }

    return tryCatchDB(async () => this.prisma.shareDeal.count(args));
  }

  override findByNearest(
    command: FindShareDealByNearestCommand,
  ): TaskEither<DBError, ShareDeal[]> {
    const args: Prisma.ShareDealFindRawArgs = {
      filter: {
        status: { $in: [ShareDealStatus.OPEN, ShareDealStatus.START] },
        'zone.coordinate': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [command.longitude, command.latitude],
            },
          },
        },
        ...(command.keyword ? { title: { $regex: command.keyword } } : {}),
        ...(command.category ? { category: command.category } : {}),
      },
      options: {
        skip: command.skip,
        take: command.size,
        projection: { id: true },
      },
    };

    return pipe(
      tryCatchDB(async () => this.prisma.shareDeal.findRaw(args)),
      TE.map((row) => unsafeCoerce<any, { _id: { $oid: string } }[]>(row)),
      TE.map((rows) => rows.map((row) => row._id.$oid)),
      TE.bindTo('ids'),
      TE.bind('shareDeals', ({ ids }) =>
        tryCatchDB(async () =>
          this.prisma.shareDeal.findMany({ where: { id: { in: ids } } }),
        ),
      ),
      TE.map(({ ids, shareDeals }) =>
        ids.map(
          (id) => shareDeals.find((deal) => deal.id === id) as OrmShareDeal,
        ),
      ),
      TE.map((deals) => deals.map(ShareDealOrmMapper.toDomain)),
    );
  }

  override findById(
    id: string,
  ): TaskEither<DBError | NotFoundException, ShareDeal> {
    return pipe(
      tryCatchDB(() => this.prisma.shareDeal.findUnique({ where: { id } })),
      TE.chainW((deal) =>
        deal
          ? TE.right(deal)
          : TE.left(
              new NotFoundException(`${id}에 해당하는 공유딜이 없습니다.`),
            ),
      ),
      TE.map(ShareDealOrmMapper.toDomain),
    );
  }

  override countByStatus(
    userId: UserId,
    status: ShareDealStatus,
  ): TaskEither<DBError, number> {
    return tryCatchDB(async () =>
      this.prisma.shareDeal.count({
        where: { status, participants: { is: { ids: { has: userId } } } },
      }),
    );
  }

  override findByUser(
    command: FindByUserShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]> {
    return pipe(
      tryCatchDB(async () =>
        this.prisma.shareDeal.findMany({
          where: {
            status: command.status,
            participants: { is: { ids: { has: command.userId } } },
          },
          orderBy: { createdAt: 'desc' },
          skip: command.skip,
          take: command.size,
        }),
      ),
      TE.map((deals) => deals.map(ShareDealOrmMapper.toDomain)),
    );
  }
}
