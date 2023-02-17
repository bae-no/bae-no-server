import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@nestjs/common';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { Sample, SampleId } from '../../../domain/Sample';

export abstract class SampleQueryUseCase {
  abstract findById(
    id: SampleId,
  ): TaskEither<DBError | NotFoundException, Sample>;
}
