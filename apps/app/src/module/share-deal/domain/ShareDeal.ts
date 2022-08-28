import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { FoodCategory } from './vo/FoodCategory';
import { ShareDealStatus } from './vo/ShareDealStatus';
import { ShareZone } from './vo/ShareZone';

export interface ShareDealProps {
  title: string;
  status: ShareDealStatus;
  category: FoodCategory;
  minParticipants: number;
  orderPrice: number;
  ownerId: string;
  participantIds: string[];
  storeName: string;
  zone: ShareZone;
}

export type CreateShareDealProps = Omit<
  ShareDealProps,
  'participantIds' | 'status'
>;

export class ShareDeal extends BaseEntity<ShareDealProps> {
  constructor(props: ShareDealProps) {
    super(props);
  }

  get title(): string {
    return this.props.title;
  }

  get category(): FoodCategory {
    return this.props.category;
  }

  get minParticipants(): number {
    return this.props.minParticipants;
  }

  get orderPrice(): number {
    return this.props.orderPrice;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get participantIds(): string[] {
    return this.props.participantIds;
  }

  get storeName(): string {
    return this.props.storeName;
  }

  get zone(): ShareZone {
    return this.props.zone;
  }

  get status(): ShareDealStatus {
    return this.props.status;
  }

  static open(props: CreateShareDealProps) {
    return new ShareDeal({
      ...props,
      participantIds: [],
      status: ShareDealStatus.OPEN,
    });
  }
}
