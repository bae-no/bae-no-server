import { T, O, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDBE } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import type { Sample as OrmSample } from '@prisma/client';

import { SampleOrmMapper } from './SampleOrmMapper';
import { SampleQueryRepositoryPort } from '../../../application/port/out/SampleQueryRepositoryPort';
import type { Sample, SampleId } from '../../../domain/Sample';

@Repository()
export class SampleQueryRepositoryAdapter extends SampleQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findById(id: SampleId): T.IO<DBError, O.Option<Sample>> {
    return pipe(
      tryCatchDBE(() => this.prisma.sample.findFirst({ where: { id } })),
      T.map(this.toDomainSample),
    );
  }

  private toDomainSample(ormEntity: OrmSample | null): O.Option<Sample> {
    return pipe(O.fromNullable(ormEntity), O.map(SampleOrmMapper.toDomain));
  }
}
