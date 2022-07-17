import { PrismaService } from '@app/prisma/PrismaService';
import { Sample as OrmSample } from '@prisma/client';

import { SampleQueryRepositoryPort } from '../../../application/port/out/SampleQueryRepositoryPort';
import { Sample } from '../../../domain/Sample';

export class SampleQueryRepositoryAdapter extends SampleQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override async findById(id: string): Promise<Sample | null> {
    return this.prisma.sample
      .findFirst({ where: { id } })
      .then(this.toDomainSample);
  }

  private toDomainSample(ormEntity: OrmSample | null): Sample {
    return Object.assign(Sample.empty(), ormEntity);
  }
}
