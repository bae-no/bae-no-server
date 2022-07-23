import { DBError } from '@app/domain/error/DBError';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { Sample } from '../../../domain/Sample';

export abstract class SampleQueryRepositoryPort {
  abstract findById(id: string): TaskEither<DBError, Option<Sample>>;
}
