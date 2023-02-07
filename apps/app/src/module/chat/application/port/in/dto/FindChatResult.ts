import { ShareDealId } from '../../../../../share-deal/domain/ShareDeal';

export class FindChatResult {
  constructor(
    readonly id: ShareDealId,
    readonly title: string,
    readonly thumbnail: string,
    readonly lastContent: string,
    readonly unreadCount: number,
  ) {}
}
