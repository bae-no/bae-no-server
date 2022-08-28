import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDeal } from '../../../domain/ShareDeal';

export abstract class ShareDealRepositoryPort {
  abstract save(shareDeal: ShareDeal): TaskEither<DBError, ShareDeal>;
}
