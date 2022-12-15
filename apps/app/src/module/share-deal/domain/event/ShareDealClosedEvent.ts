import { DomainEvent } from '@app/domain/event/DomainEvent';

export class ShareDealClosedEvent extends DomainEvent {
  constructor(readonly shareDealId: string) {
    super();
  }
}
