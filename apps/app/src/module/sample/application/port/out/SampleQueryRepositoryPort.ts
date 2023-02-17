import type { DBError } from '@app/domain/error/DBError';
import type { Option } from 'fp-ts/Option';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { Sample, SampleId } from '../../../domain/Sample';

export abstract class SampleQueryRepositoryPort {
  abstract findById(id: SampleId): TaskEither<DBError, Option<Sample>>;
}
