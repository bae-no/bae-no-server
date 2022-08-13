import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample } from '../../../domain/Sample';
import { CreateSampleCommand } from './dto/CreateSampleCommand';

export abstract class SampleCommandUseCase {
  abstract create(command: CreateSampleCommand): TaskEither<DBError, Sample>;
}
