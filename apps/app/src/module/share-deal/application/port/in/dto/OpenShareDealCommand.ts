import { UserId } from '../../../../../user/domain/User';
import { AddressSystem } from '../../../../../user/domain/vo/AddressSystem';
import { ShareDeal } from '../../../../domain/ShareDeal';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';
import { ShareZone } from '../../../../domain/vo/ShareZone';

export class OpenShareDealCommand {
  constructor(
    readonly userId: UserId,
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

  toDomain(): ShareDeal {
    return ShareDeal.open({
      title: this.title,
      category: this.category,
      maxParticipants: this.maxParticipants,
      orderPrice: this.orderPrice,
      ownerId: this.userId,
      storeName: this.storeName,
      thumbnail: this.thumbnail,
      zone: new ShareZone(
        this.addressSystem,
        this.addressPath,
        this.addressDetail,
        this.latitude,
        this.longitude,
      ),
    });
  }
}
