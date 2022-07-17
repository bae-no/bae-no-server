import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { Sample as OrmSample } from '@prisma/client';

import { SampleRepositoryPort } from '../../../application/port/out/SampleRepositoryPort';
import { Sample } from '../../../domain/Sample';

@Injectable()
export class SampleRepositoryAdapter extends SampleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override async save(sample: Sample): Promise<Sample> {
    return this.prisma.sample
      .create({ data: sample })
      .then(this.toDomainSample);
  }

  private toDomainSample(ormEntity: OrmSample | null): Sample {
    return Object.assign(Sample.empty(), ormEntity);
  }
}
