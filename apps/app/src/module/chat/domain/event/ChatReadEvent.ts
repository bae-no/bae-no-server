import { DomainEvent } from '@app/domain/event/DomainEvent';

import { ShareDealId } from '../../../share-deal/domain/ShareDeal';
import { UserId } from '../../../user/domain/User';

export class ChatReadEvent extends DomainEvent {
  constructor(readonly userId: UserId, readonly shareDealId: ShareDealId) {
    super();
  }
}
