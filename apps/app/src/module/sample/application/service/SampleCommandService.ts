import { Injectable } from '@nestjs/common';

import { Sample } from '../../domain/Sample';
import { CreateSampleCommand } from '../port/in/CreateSampleCommand';
import { SampleCommandUseCase } from '../port/in/SampleCommandUseCase';
import { SampleRepositoryPort } from '../port/out/SampleRepositoryPort';

@Injectable()
export class SampleCommandService extends SampleCommandUseCase {
  constructor(private readonly sampleRepositoryPort: SampleRepositoryPort) {
    super();
  }

  override async create(command: CreateSampleCommand): Promise<Sample> {
    const sample = Sample.of({ name: command.name, email: command.email });

    return this.sampleRepositoryPort.save(sample);
  }
}
