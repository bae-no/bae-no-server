import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@nestjs/common';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample } from '../../../domain/Sample';

export abstract class SampleQueryUseCase {
  abstract findById(
    id: string,
  ): TaskEither<DBError | NotFoundException, Sample>;
}
