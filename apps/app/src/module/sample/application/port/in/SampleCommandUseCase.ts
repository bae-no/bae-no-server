import type { DBError } from '@app/domain/error/DBError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { CreateSampleCommand } from './dto/CreateSampleCommand';
import type { Sample } from '../../../domain/Sample';

export abstract class SampleCommandUseCase {
  abstract create(command: CreateSampleCommand): TaskEither<DBError, Sample>;
}
