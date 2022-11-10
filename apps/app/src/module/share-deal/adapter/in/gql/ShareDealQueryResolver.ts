import { toResponse, toResponseArray } from '@app/custom/fp-ts';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { identity, pipe } from 'fp-ts/function';

import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
import { FindShareDealByNearestInput } from './input/FindShareDealByNearestInput';
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

  @Query(() => [ShareDealResponse], { description: '공유딜 목록 (가까운 순)' })
  async shareDealsByNearest(
    @Args('input') input: FindShareDealByNearestInput,
  ): Promise<ShareDealResponse[]> {
    return pipe(
      input.toCommand(),
      (command) => this.shareDealQueryRepositoryPort.findByNearest(command),
      toResponseArray(ShareDealResponse.of),
    )();
  }

  @Query(() => Int, { description: '내가 참여완료한 공유딜 개수' })
  async myEndDealCount(@CurrentSession() session: Session): Promise<number> {
    return pipe(
      this.shareDealQueryRepositoryPort.countByStatus(
        session.id,
        ShareDealStatus.END,
      ),
      toResponse(identity),
    )();
  }
}
