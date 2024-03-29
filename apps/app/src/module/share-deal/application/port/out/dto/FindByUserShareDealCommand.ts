import { PageCommand } from '@app/domain/command/PageCommand';

import { UserId } from '../../../../../user/domain/User';
import { ShareDealStatus } from '../../../../domain/vo/ShareDealStatus';

export class FindByUserShareDealCommand extends PageCommand {
  constructor(
    readonly userId: UserId,
    readonly status: ShareDealStatus,
    page?: number,
    size?: number,
  ) {
    super(page, size);
  }
}
