import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample } from '../../../domain/Sample';

export abstract class SampleRepositoryPort {
  abstract save(sample: Sample): TaskEither<DBError, Sample>;
}
