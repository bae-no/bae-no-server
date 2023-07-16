import { DomainEvent } from '@app/domain/event/DomainEvent';

import { ShareDealId } from '../ShareDeal';

export class ShareDealStartedEvent extends DomainEvent {
  constructor(readonly shareDealId: ShareDealId) {
    super();
  }
}
