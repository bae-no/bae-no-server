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
}
