import { O, TE } from '@app/custom/fp-ts';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import type { Sample as OrmSample } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import type { Option } from 'fp-ts/Option';
import type { TaskEither } from 'fp-ts/TaskEither';

import { SampleOrmMapper } from './SampleOrmMapper';
import { SampleQueryRepositoryPort } from '../../../application/port/out/SampleQueryRepositoryPort';
import type { Sample, SampleId } from '../../../domain/Sample';

@Repository()
export class SampleQueryRepositoryAdapter extends SampleQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findById(id: SampleId): TaskEither<DBError, Option<Sample>> {
    return pipe(
      tryCatchDB(() => this.prisma.sample.findFirst({ where: { id } })),
      TE.map(this.toDomainSample),
    );
  }

  private toDomainSample(ormEntity: OrmSample | null): Option<Sample> {
    return pipe(O.fromNullable(ormEntity), O.map(SampleOrmMapper.toDomain));
  }
}
