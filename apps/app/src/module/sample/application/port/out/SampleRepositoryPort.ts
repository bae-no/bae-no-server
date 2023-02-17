import type { DBError } from '@app/domain/error/DBError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { Sample } from '../../../domain/Sample';

export abstract class SampleRepositoryPort {
  abstract save(sample: Sample): TaskEither<DBError, Sample>;
}
