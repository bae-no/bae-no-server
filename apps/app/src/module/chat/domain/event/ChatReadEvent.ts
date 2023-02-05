import { DomainEvent } from '@app/domain/event/DomainEvent';

import { UserId } from '../../../user/domain/User';

export class ChatReadEvent extends DomainEvent {
  constructor(readonly userId: UserId, readonly shareDealId: string) {
    super();
  }
}
