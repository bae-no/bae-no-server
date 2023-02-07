import { DBError } from '@app/domain/error/DBError';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample, SampleId } from '../../../domain/Sample';

export abstract class SampleQueryRepositoryPort {
  abstract findById(id: SampleId): TaskEither<DBError, Option<Sample>>;
}
