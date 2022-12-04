import { DomainEvent } from '@app/domain/event/DomainEvent';

export class ChatReadEvent extends DomainEvent {
  constructor(readonly userId: string, readonly shareDealId: string) {
    super();
  }
}
