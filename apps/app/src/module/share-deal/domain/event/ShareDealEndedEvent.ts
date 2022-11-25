export class ShareDealEndedEvent {
  static readonly EVENT_NAME = 'shareDeal.ended';

  constructor(readonly shareDealId: string) {}
}
