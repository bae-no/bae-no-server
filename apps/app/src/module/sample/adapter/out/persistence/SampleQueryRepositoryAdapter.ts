import { O, TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Sample as OrmSample } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { SampleQueryRepositoryPort } from '../../../application/port/out/SampleQueryRepositoryPort';
import { Sample } from '../../../domain/Sample';
import { SampleOrmMapper } from './SampleOrmMapper';

export class SampleQueryRepositoryAdapter extends SampleQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findById(id: string): TaskEither<DBError, Option<Sample>> {
    return pipe(
      tryCatchDB(() => this.prisma.sample.findFirst({ where: { id } })),
      TE.map(this.toDomainSample),
    );
  }

  private toDomainSample(ormEntity: OrmSample | null): Option<Sample> {
    return pipe(O.fromNullable(ormEntity), O.map(SampleOrmMapper.toDomain));
  }
}
