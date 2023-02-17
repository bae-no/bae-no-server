import { DomainEvent } from '@app/domain/event/DomainEvent';

import type { ShareDealId } from '../ShareDeal';

export class ShareDealEndedEvent extends DomainEvent {
  constructor(readonly shareDealId: ShareDealId) {
    super();
  }
}
