import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { CreateSampleCommand } from './dto/CreateSampleCommand';
import { Sample } from '../../../domain/Sample';

export abstract class SampleCommandUseCase {
  abstract create(command: CreateSampleCommand): TaskEither<DBError, Sample>;
}
