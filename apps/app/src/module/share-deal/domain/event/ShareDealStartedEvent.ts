export class ShareDealStartedEvent {
  static readonly EVENT_NAME = 'shareDeal.started';

  constructor(readonly shareDealId: string) {}
}
