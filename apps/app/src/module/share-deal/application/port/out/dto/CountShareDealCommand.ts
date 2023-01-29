import { FoodCategory } from '../../../../domain/vo/FoodCategory';

export class CountShareDealCommand {
  constructor(readonly keyword?: string, readonly category?: FoodCategory) {}
}
