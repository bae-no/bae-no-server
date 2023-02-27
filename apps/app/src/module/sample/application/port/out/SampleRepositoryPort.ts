import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { Sample } from '../../../domain/Sample';

export abstract class SampleRepositoryPort {
  abstract save(sample: Sample): T.IO<DBError, Sample>;
}
