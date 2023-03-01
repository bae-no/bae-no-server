import { T, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDBE } from '@app/domain/error/DBError';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { PrismaService } from '@app/prisma/PrismaService';

import { ShareDealOrmMapper } from './ShareDealOrmMapper';
import { ShareDealRepositoryPort } from '../../../application/port/out/ShareDealRepositoryPort';
import type { ShareDeal } from '../../../domain/ShareDeal';

@Repository()
export class ShareDealRepositoryAdapter extends ShareDealRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitterPort: EventEmitterPort,
  ) {
    super();
  }

  override save(shareDeal: ShareDeal): T.IO<DBError, ShareDeal> {
    return pipe(
      ShareDealOrmMapper.toOrm(shareDeal),
      ({ id, ...data }) =>
        tryCatchDBE(() =>
          id
            ? this.prisma.shareDeal.update({ data, where: { id } })
            : this.prisma.shareDeal.create({ data }),
        ),
      T.map(ShareDealOrmMapper.toDomain),
      T.map((newShareDeal) => {
        shareDeal.publishDomainEvents(this.eventEmitterPort);

        return newShareDeal;
      }),
    );
  }
}
