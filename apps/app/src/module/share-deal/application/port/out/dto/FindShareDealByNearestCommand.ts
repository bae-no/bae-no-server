import { PageCommand } from '@app/domain/command/PageCommand';

import type { FoodCategory } from '../../../../domain/vo/FoodCategory';

interface FindShareDealByNearestCommandParams {
  keyword?: string;
  category?: FoodCategory;
  latitude: number;
  longitude: number;
  page?: number;
  size?: number;
}

export class FindShareDealByNearestCommand extends PageCommand {
  private constructor(
    readonly keyword: string | undefined,
    readonly category: FoodCategory | undefined,
    readonly latitude: number,
    readonly longitude: number,
    page?: number,
    size?: number,
  ) {
    super(page, size);
  }

  static of(props: FindShareDealByNearestCommandParams) {
    return new FindShareDealByNearestCommand(
      props.keyword,
      props.category,
      props.latitude,
      props.longitude,
      props.page,
      props.size,
    );
  }
}
