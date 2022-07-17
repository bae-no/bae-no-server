import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Injectable } from '@nestjs/common';

import { Sample } from '../../domain/Sample';
import { SampleQueryUseCase } from '../port/in/SampleQueryUseCase';
import { SampleQueryRepositoryPort } from '../port/out/SampleQueryRepositoryPort';

@Injectable()
export class SampleQueryService extends SampleQueryUseCase {
  constructor(
    private readonly sampleQueryRepositoryPort: SampleQueryRepositoryPort,
  ) {
    super();
  }

  override async findById(id: string): Promise<Sample> {
    const sample = await this.sampleQueryRepositoryPort.findById(id);

    if (!sample) {
      throw new NotFoundException('sample 이 존재하지 않습니다');
    }

    return sample;
  }
}
