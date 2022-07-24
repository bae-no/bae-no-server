import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { TE } from '@app/domain/fp-ts';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { SampleRepositoryPort } from '../../../application/port/out/SampleRepositoryPort';
import { Sample } from '../../../domain/Sample';
import { SampleOrmMapper } from './SampleOrmMapper';

@Injectable()
export class SampleRepositoryAdapter extends SampleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(sample: Sample): TaskEither<DBError, Sample> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.sample.create({
          data: {
            name: sample.name,
            email: sample.email,
          },
        }),
      ),
      TE.map(SampleOrmMapper.toDomain),
    );
  }
}
