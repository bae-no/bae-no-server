import { DomainEvent } from '@app/domain/event/DomainEvent';

export class ShareDealStartedEvent extends DomainEvent {
  constructor(readonly shareDealId: string) {
    super();
  }
}
