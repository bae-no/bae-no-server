import { DBError } from '@app/domain/error/DBError';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample } from '../../domain/Sample';
import { CreateSampleCommand } from '../port/in/CreateSampleCommand';
import { SampleCommandUseCase } from '../port/in/SampleCommandUseCase';
import { SampleRepositoryPort } from '../port/out/SampleRepositoryPort';

@Injectable()
export class SampleCommandService extends SampleCommandUseCase {
  constructor(private readonly sampleRepositoryPort: SampleRepositoryPort) {
    super();
  }

  override create(command: CreateSampleCommand): TaskEither<DBError, Sample> {
    return pipe(
      Sample.of({ name: command.name, email: command.email }),
      (sample) => this.sampleRepositoryPort.save(sample),
    );
  }
}
