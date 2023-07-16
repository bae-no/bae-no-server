import { O } from '@app/custom/effect';

import { ShareDealId } from '../../../../../share-deal/domain/ShareDeal';
import type { Chat } from '../../../../domain/Chat';

export class FindChatResult {
  constructor(
    readonly id: ShareDealId,
    readonly title: string,
    readonly thumbnail: string,
    readonly lastChat: O.Option<Chat>,
    readonly unreadCount: number,
  ) {}
}
