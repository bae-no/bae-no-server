import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDeal } from '../../../domain/ShareDeal';
import { FindShareDealCommand } from './dto/FindShareDealCommand';

export abstract class ShareDealQueryRepositoryPort {
  abstract find(
    findShareDealCommand: FindShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;
}
