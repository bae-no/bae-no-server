import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { FoodCategory } from './vo/FoodCategory';
import { ParticipantInfo } from './vo/ParticipantInfo';
import { ShareDealStatus } from './vo/ShareDealStatus';
import { ShareZone } from './vo/ShareZone';

export interface ShareDealProps {
  title: string;
  status: ShareDealStatus;
  category: FoodCategory;
  orderPrice: number;
  ownerId: string;
  participantInfo: ParticipantInfo;
  storeName: string;
  thumbnail: string;
  zone: ShareZone;
}

export type CreateShareDealProps = Omit<
  ShareDealProps,
  'status' | 'participantInfo'
> & {
  minParticipants: number;
};

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

  get orderPrice(): number {
    return this.props.orderPrice;
  }

  get ownerId(): string {
    return this.props.ownerId;
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

  get thumbnail(): string {
    return this.props.thumbnail;
  }

  get participantInfo(): ParticipantInfo {
    return this.props.participantInfo;
  }

  static open(props: CreateShareDealProps): ShareDeal {
    const { ownerId, minParticipants, ...otherProps } = props;

    return new ShareDeal({
      ...otherProps,
      ownerId,
      participantInfo: ParticipantInfo.of([ownerId], minParticipants),
      status: ShareDealStatus.OPEN,
    });
  }
}
