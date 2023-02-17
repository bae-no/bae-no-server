import { CursorCommand } from '@app/domain/command/CursorCommand';

import type { ShareDealId } from '../../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../../user/domain/User';

export class FindChatByUserCommand extends CursorCommand<string> {
  constructor(
    readonly shareDealId: ShareDealId,
    readonly userId: UserId,
    cursor?: string,
    size?: number,
  ) {
    super(cursor, size);
  }
}
