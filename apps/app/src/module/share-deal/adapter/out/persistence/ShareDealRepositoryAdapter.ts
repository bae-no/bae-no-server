import { TE } from '@app/custom/fp-ts';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealOrmMapper } from './ShareDealOrmMapper';
import { ShareDealRepositoryPort } from '../../../application/port/out/ShareDealRepositoryPort';
import type { ShareDeal } from '../../../domain/ShareDeal';

@Injectable()
export class ShareDealRepositoryAdapter extends ShareDealRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitterPort: EventEmitterPort,
  ) {
    super();
  }

  override save(shareDeal: ShareDeal): TaskEither<DBError, ShareDeal> {
    return pipe(
      ShareDealOrmMapper.toOrm(shareDeal),
      ({ id, ...data }) =>
        tryCatchDB(() =>
          id
            ? this.prisma.shareDeal.update({ data, where: { id } })
            : this.prisma.shareDeal.create({ data }),
        ),
      TE.map(ShareDealOrmMapper.toDomain),
      TE.map((newShareDeal) => {
        shareDeal.publishDomainEvents(this.eventEmitterPort);

        return newShareDeal;
      }),
    );
  }
}
