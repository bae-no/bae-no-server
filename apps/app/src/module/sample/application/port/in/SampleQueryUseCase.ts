import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@nestjs/common';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample, SampleId } from '../../../domain/Sample';

export abstract class SampleQueryUseCase {
  abstract findById(
    id: SampleId,
  ): TaskEither<DBError | NotFoundException, Sample>;
}
