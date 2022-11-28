import { DomainEvent } from '@app/domain/event/DomainEvent';

export class ShareDealEndedEvent extends DomainEvent {
  constructor(readonly shareDealId: string) {
    super();
  }
}
