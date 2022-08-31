import { FoodCategory } from '../../../../domain/vo/FoodCategory';
import { ShareDealSortType } from './ShareDealSortType';

interface FindShareDealCommandParams {
  keyword?: string;
  category?: FoodCategory;
  sortType: ShareDealSortType;
  size: number;
  cursor?: Date;
}

export class FindShareDealCommand {
  private constructor(
    readonly keyword: string | undefined,
    readonly category: FoodCategory | undefined,
    readonly sortType: ShareDealSortType,
    readonly cursor: Date | undefined,
    readonly size: number,
  ) {}

  static of(props: FindShareDealCommandParams) {
    return new FindShareDealCommand(
      props.keyword,
      props.category,
      props.sortType,
      props.cursor,
      props.size,
    );
  }
}
