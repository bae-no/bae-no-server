import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealRepositoryPort } from '../../../application/port/out/ShareDealRepositoryPort';
import { ShareDeal } from '../../../domain/ShareDeal';
import { ShareDealOrmMapper } from './ShareDealOrmMapper';

@Injectable()
export class ShareDealRepositoryAdapter extends ShareDealRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(shareDeal: ShareDeal): TaskEither<DBError, ShareDeal> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.shareDeal.create({
          data: ShareDealOrmMapper.toOrm(shareDeal),
        }),
      ),
      TE.map(ShareDealOrmMapper.toDomain),
    );
  }
}
