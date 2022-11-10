import { PageCommand } from '@app/domain/command/PageCommand';

import { FoodCategory } from '../../../../domain/vo/FoodCategory';

interface FindShareDealCommandParams {
  keyword?: string;
  category?: FoodCategory;
  addressKey: number;
  page?: number;
  size?: number;
}

export class FindShareDealByNearestCommand extends PageCommand {
  private constructor(
    readonly keyword: string | undefined,
    readonly category: FoodCategory | undefined,
    readonly addressKey: number,
    page?: number,
    size?: number,
  ) {
    super(page, size);
  }

  static of(props: FindShareDealCommandParams) {
    return new FindShareDealByNearestCommand(
      props.keyword,
      props.category,
      props.addressKey,
      props.page,
      props.size,
    );
  }
}
