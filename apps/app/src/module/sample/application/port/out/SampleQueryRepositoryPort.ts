import type { T, O } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { Sample, SampleId } from '../../../domain/Sample';

export abstract class SampleQueryRepositoryPort {
  abstract findById(id: SampleId): T.IO<DBError, O.Option<Sample>>;
}
