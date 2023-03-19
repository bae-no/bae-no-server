import { T, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';

import { SampleOrmMapper } from './SampleOrmMapper';
import { SampleRepositoryPort } from '../../../application/port/out/SampleRepositoryPort';
import type { Sample } from '../../../domain/Sample';

@Repository()
export class SampleRepositoryAdapter extends SampleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(sample: Sample): T.IO<DBError, Sample> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.sample.create({
          data: {
            name: sample.name,
            email: sample.email,
          },
        }),
      ),
      T.map(SampleOrmMapper.toDomain),
    );
  }
}
