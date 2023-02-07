import { UserId } from '../../../../../user/domain/User';
import { AddressSystem } from '../../../../../user/domain/vo/AddressSystem';
import {
  ShareDealId,
  UpdateShareDealProps,
} from '../../../../domain/ShareDeal';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';

export class UpdateShareDealCommand {
  constructor(
    readonly userId: UserId,
    readonly shareDealId: ShareDealId,
    readonly title: string,
    readonly category: FoodCategory,
    readonly maxParticipants: number,
    readonly orderPrice: number,
    readonly storeName: string,
    readonly thumbnail: string,
    readonly addressSystem: AddressSystem,
    readonly addressPath: string,
    readonly addressDetail: string,
    readonly latitude: number,
    readonly longitude: number,
  ) {}

  toShareDealProps(): UpdateShareDealProps {
    return {
      title: this.title,
      category: this.category,
      maxParticipants: this.maxParticipants,
      orderPrice: this.orderPrice,
      storeName: this.storeName,
      thumbnail: this.thumbnail,
      system: this.addressSystem,
      path: this.addressPath,
      detail: this.addressDetail,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
