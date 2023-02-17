import { TE } from '@app/custom/fp-ts';
import type { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { Sample, SampleId } from '../../domain/Sample';
import { SampleQueryUseCase } from '../port/in/SampleQueryUseCase';
import { SampleQueryRepositoryPort } from '../port/out/SampleQueryRepositoryPort';

@Injectable()
export class SampleQueryService extends SampleQueryUseCase {
  constructor(
    private readonly sampleQueryRepositoryPort: SampleQueryRepositoryPort,
  ) {
    super();
  }

  override findById(
    id: SampleId,
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
