import { Module } from '@nestjs/common';

import { CategoryQueryResolver } from './adapter/in/gql/CategoryQueryResolver';

@Module({
  providers: [CategoryQueryResolver],
})
export class CategoryModule {}
