import type { T } from '@app/custom/effect';
import { pipe } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';

import { Sample } from '../../domain/Sample';
import type { CreateSampleCommand } from '../port/in/dto/CreateSampleCommand';
import { SampleCommandUseCase } from '../port/in/SampleCommandUseCase';
import { SampleRepositoryPort } from '../port/out/SampleRepositoryPort';

@Service()
export class SampleCommandService extends SampleCommandUseCase {
  constructor(private readonly sampleRepositoryPort: SampleRepositoryPort) {
    super();
  }

  override create(command: CreateSampleCommand): T.IO<DBError, Sample> {
    return pipe(
      Sample.of({ name: command.name, email: command.email }),
      (sample) => this.sampleRepositoryPort.save(sample),
    );
  }
}
