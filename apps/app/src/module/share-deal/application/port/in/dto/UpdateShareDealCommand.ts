import { UpdateShareDealProps } from '../../../../domain/ShareDeal';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';

export class UpdateShareDealCommand {
  constructor(
    readonly userId: string,
    readonly shareDealId: string,
    readonly title: string,
    readonly category: FoodCategory,
    readonly maxParticipants: number,
    readonly orderPrice: number,
    readonly storeName: string,
    readonly thumbnail: string,
    readonly addressRoad: string,
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
      road: this.addressRoad,
      detail: this.addressDetail,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
