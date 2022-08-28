import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { FoodCategory } from './vo/FoodCategory';
import { ShareZone } from './vo/ShareZone';

export interface ShareDealProps {
  title: string;
  category: FoodCategory;
  minParticipants: number;
  orderPrice: number;
  ownerId: string;
  participantIds: string[];
  storeName: string;
  zone: ShareZone;
}

export type CreateShareDealProps = ShareDealProps;

export class ShareDeal extends BaseEntity<ShareDealProps> {
  private constructor(props: ShareDealProps) {
    super(props);
  }

  static of(props: CreateShareDealProps) {
    return new ShareDeal(props);
  }
}
