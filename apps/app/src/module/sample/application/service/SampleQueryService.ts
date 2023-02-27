import { T, pipe, O } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';

import type { Sample, SampleId } from '../../domain/Sample';
import { SampleQueryUseCase } from '../port/in/SampleQueryUseCase';
import { SampleQueryRepositoryPort } from '../port/out/SampleQueryRepositoryPort';

@Service()
export class SampleQueryService extends SampleQueryUseCase {
  constructor(
    private readonly sampleQueryRepositoryPort: SampleQueryRepositoryPort,
  ) {
    super();
  }

  override findById(id: SampleId): T.IO<DBError | NotFoundException, Sample> {
    return pipe(
      this.sampleQueryRepositoryPort.findById(id),
      T.chain((optionSample) => {
        if (O.isNone(optionSample)) {
          return T.fail(new NotFoundException('sample 이 존재하지 않습니다'));
        }

        return T.succeed(optionSample.value);
      }),
    );
  }
}
