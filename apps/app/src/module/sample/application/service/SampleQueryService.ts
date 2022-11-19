import { TE } from '@app/custom/fp-ts';
import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample } from '../../domain/Sample';
import { SampleQueryUseCase } from '../port/in/SampleQueryUseCase';
import { SampleQueryRepositoryPort } from '../port/out/SampleQueryRepositoryPort';

export class SampleQueryService extends SampleQueryUseCase {
  constructor(
    private readonly sampleQueryRepositoryPort: SampleQueryRepositoryPort,
  ) {
    super();
  }

  override findById(
    id: string,
  ): TaskEither<DBError | NotFoundException, Sample> {
    return pipe(
      this.sampleQueryRepositoryPort.findById(id),
      TE.chainW(
        TE.fromOption(
          () => new NotFoundException('sample 이 존재하지 않습니다'),
        ),
      ),
    );
  }
}
