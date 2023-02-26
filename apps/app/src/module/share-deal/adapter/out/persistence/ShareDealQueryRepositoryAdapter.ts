import { T, pipe } from '@app/custom/effect';
import { TE } from '@app/custom/fp-ts';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB, tryCatchDBE } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import type { ShareDeal as OrmShareDeal } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealOrmMapper } from './ShareDealOrmMapper';
import type { UserId } from '../../../../user/domain/User';
import type { CountShareDealCommand } from '../../../application/port/out/dto/CountShareDealCommand';
import type { FindByUserShareDealCommand } from '../../../application/port/out/dto/FindByUserShareDealCommand';
import type { FindShareDealByNearestCommand } from '../../../application/port/out/dto/FindShareDealByNearestCommand';
import type { FindShareDealCommand } from '../../../application/port/out/dto/FindShareDealCommand';
import { ShareDealSortType } from '../../../application/port/out/dto/ShareDealSortType';
import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import type { ShareDeal, ShareDealId } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';

@Repository()
export class ShareDealQueryRepositoryAdapter extends ShareDealQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override find(command: FindShareDealCommand): T.IO<DBError, ShareDeal[]> {
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
      tryCatchDBE(async () => this.prisma.shareDeal.findMany(args)),
      T.map((deals) => deals.map(ShareDealOrmMapper.toDomain)),
    );
  }

  override count(command: CountShareDealCommand): T.IO<DBError, number> {
    const args: Prisma.ShareDealCountArgs = {
      where: { status: { in: [ShareDealStatus.OPEN, ShareDealStatus.START] } },
    };

    if (command.keyword) {
      args.where = { ...args.where, title: { contains: command.keyword } };
    }

    if (command.category) {
      args.where = { ...args.where, category: command.category };
    }

    return tryCatchDBE(async () => this.prisma.shareDeal.count(args));
  }

  override findByNearest(
    command: FindShareDealByNearestCommand,
  ): T.IO<DBError, ShareDeal[]> {
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
      tryCatchDBE(async () => this.prisma.shareDeal.findRaw(args)),
      T.map((rows) => rows as unknown as { _id: { $oid: string } }[]),
      T.map((rows) => rows.map((row) => row._id.$oid)),
      T.chain((ids) =>
        T.structPar({
          ids: T.succeed(ids),
          shareDeals: tryCatchDBE(async () =>
            this.prisma.shareDeal.findMany({ where: { id: { in: ids } } }),
          ),
        }),
      ),
      T.map(({ ids, shareDeals }) =>
        ids.map(
          (id) => shareDeals.find((deal) => deal.id === id) as OrmShareDeal,
        ),
      ),
      T.map((deals) => deals.map(ShareDealOrmMapper.toDomain)),
    );
  }

  override findById(
    id: ShareDealId,
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

  override findByIdE(
    id: ShareDealId,
  ): T.IO<DBError | NotFoundException, ShareDeal> {
    return pipe(
      tryCatchDBE(() => this.prisma.shareDeal.findUnique({ where: { id } })),
      T.chain((deal) =>
        deal
          ? T.succeed(deal)
          : T.fail(
              new NotFoundException(`${id}에 해당하는 공유딜이 없습니다.`),
            ),
      ),
      T.map(ShareDealOrmMapper.toDomain),
    );
  }

  override countByStatus(
    userId: UserId,
    status: ShareDealStatus,
  ): T.IO<DBError, number> {
    return tryCatchDBE(async () =>
      this.prisma.shareDeal.count({
        where: { status, participants: { is: { ids: { has: userId } } } },
      }),
    );
  }

  override findByUser(
    command: FindByUserShareDealCommand,
  ): T.IO<DBError, ShareDeal[]> {
    return pipe(
      tryCatchDBE(async () =>
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
      T.map((deals) => deals.map(ShareDealOrmMapper.toDomain)),
    );
  }
}
