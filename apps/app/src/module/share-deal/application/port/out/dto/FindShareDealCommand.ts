import { PageCommand } from '@app/domain/command/PageCommand';

import { ShareDealSortType } from './ShareDealSortType';
import type { FoodCategory } from '../../../../domain/vo/FoodCategory';

interface FindShareDealCommandParams {
  keyword?: string;
  category?: FoodCategory;
  sortType: ShareDealSortType;
  page?: number;
  size?: number;
}

export class FindShareDealCommand extends PageCommand {
  private constructor(
    readonly keyword: string | undefined,
    readonly category: FoodCategory | undefined,
    readonly sortType: ShareDealSortType,
    page?: number,
    size?: number,
  ) {
    super(page, size);
  }

  static of(props: FindShareDealCommandParams) {
    return new FindShareDealCommand(
      props.keyword,
      props.category,
      props.sortType,
      props.page,
      props.size,
    );
  }
}
