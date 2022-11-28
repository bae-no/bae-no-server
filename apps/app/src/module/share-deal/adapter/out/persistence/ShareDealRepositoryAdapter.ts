import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealRepositoryPort } from '../../../application/port/out/ShareDealRepositoryPort';
import { ShareDeal } from '../../../domain/ShareDeal';
import { ShareDealOrmMapper } from './ShareDealOrmMapper';

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
      TE.map((shareDeal) => {
        shareDeal.publishDomainEvents(this.eventEmitterPort);

        return shareDeal;
      }),
    );
  }
}
