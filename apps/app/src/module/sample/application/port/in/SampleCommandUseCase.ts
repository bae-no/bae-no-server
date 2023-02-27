import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { CreateSampleCommand } from './dto/CreateSampleCommand';
import type { Sample } from '../../../domain/Sample';

export abstract class SampleCommandUseCase {
  abstract create(command: CreateSampleCommand): T.IO<DBError, Sample>;
}
