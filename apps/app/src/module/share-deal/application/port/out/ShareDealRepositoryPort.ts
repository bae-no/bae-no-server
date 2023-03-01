import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { ShareDeal } from '../../../domain/ShareDeal';

export abstract class ShareDealRepositoryPort {
  abstract save(shareDeal: ShareDeal): T.IO<DBError, ShareDeal>;
}
