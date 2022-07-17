import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { Sample as OrmSample } from '@prisma/client';

import { SampleQueryRepositoryPort } from '../../../application/port/out/SampleQueryRepositoryPort';
import { Sample } from '../../../domain/Sample';

@Injectable()
export class SampleQueryRepositoryAdapter extends SampleQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override async findById(id: string): Promise<Sample | null> {
    return this.prisma.sample
      .findFirst({ where: { id } })
      .then(this.toDomainSample);
  }

  private toDomainSample(ormEntity: OrmSample | null): Sample | null {
    if (!ormEntity) {
      return null;
    }

    return Object.assign(Sample.empty(), ormEntity);
  }
}
