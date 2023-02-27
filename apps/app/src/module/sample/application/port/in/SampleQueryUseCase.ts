import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@nestjs/common';

import type { Sample, SampleId } from '../../../domain/Sample';

export abstract class SampleQueryUseCase {
  abstract findById(id: SampleId): T.IO<DBError | NotFoundException, Sample>;
}
