import { toResponseArray } from '@app/external/fp-ts';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import { FindShareDealInput } from './input/FindShareDealInput';
import { ShareDealResponse } from './response/ShareDealResponse';

@Resolver()
export class ShareDealQueryResolver {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
  ) {}

  @Query(() => [ShareDealResponse], { description: '공유딜 목록' })
  async shareDeals(
    @Args('input') input: FindShareDealInput,
  ): Promise<ShareDealResponse[]> {
    return pipe(
      input.toCommand(),
      (command) => this.shareDealQueryRepositoryPort.find(command),
      toResponseArray(ShareDealResponse.of),
    )();
  }
}
