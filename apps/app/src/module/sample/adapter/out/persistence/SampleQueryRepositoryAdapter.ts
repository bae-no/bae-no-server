import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { Sample as OrmSample } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { TaskEither } from 'fp-ts/TaskEither';

import { SampleQueryRepositoryPort } from '../../../application/port/out/SampleQueryRepositoryPort';
import { Sample } from '../../../domain/Sample';

@Injectable()
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
    return pipe(
      O.fromNullable(ormEntity),
      O.map((v) => Object.assign(Sample.empty(), v)),
    );
  }
}
