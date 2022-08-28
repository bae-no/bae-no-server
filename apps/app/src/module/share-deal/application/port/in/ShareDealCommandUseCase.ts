import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { OpenShareDealCommand } from './dto/OpenShareDealCommand';

export abstract class ShareDealCommandUseCase {
  abstract open(command: OpenShareDealCommand): TaskEither<DBError, void>;
}
