import type { DBError } from '@app/domain/error/DBError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { ShareDeal } from '../../../domain/ShareDeal';

export abstract class ShareDealRepositoryPort {
  abstract save(shareDeal: ShareDeal): TaskEither<DBError, ShareDeal>;
}
