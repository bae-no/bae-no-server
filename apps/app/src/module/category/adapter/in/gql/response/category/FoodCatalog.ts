import { Field, ObjectType } from '@nestjs/graphql';

import { FoodCategory } from '../../../../../../share-deal/domain/vo/FoodCategory';

@ObjectType()
export class FoodCatalog {
  static readonly foodCatalogs: Record<FoodCategory, string> = {
    [FoodCategory.KOREAN]: '한식',
    [FoodCategory.CHINESE]: '중식',
    [FoodCategory.JAPANESE]: '일식',
    [FoodCategory.AMERICAN]: '양식',
    [FoodCategory.STREET]: '분식',
    [FoodCategory.CHICKEN]: '치킨',
    [FoodCategory.PIZZA]: '피자',
    [FoodCategory.BURGER]: '버거',
    [FoodCategory.SOUP]: '찜/탕',
    [FoodCategory.MEAT]: '고기/구이',
    [FoodCategory.ASIAN]: '아시아',
    [FoodCategory.DESERT]: '디저트',
    [FoodCategory.SALAD]: '샐러드',
    [FoodCategory.LUNCH_BOX]: '도시락',
  };

  @Field(() => FoodCategory)
  code: FoodCategory;

  @Field()
  name: string;

  constructor(code: FoodCategory, name: string) {
    this.code = code;
    this.name = name;
  }
}

export const FOOD_CATALOG_VALUES = Object.entries(FoodCatalog.foodCatalogs).map(
  ([key, value]) => new FoodCatalog(key as FoodCategory, value),
);
