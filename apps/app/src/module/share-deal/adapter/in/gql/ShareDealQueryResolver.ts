import { TE, toResponse, toResponseArray } from '@app/custom/fp-ts';
import { NotFoundException } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { identity, pipe } from 'fp-ts/function';

import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { UserQueryRepositoryPort } from '../../../../user/application/port/out/UserQueryRepositoryPort';
import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
import { FindShareDealByNearestInput } from './input/FindShareDealByNearestInput';
import { FindShareDealInput } from './input/FindShareDealInput';
import { ShareDealResponse } from './response/ShareDealResponse';

@Resolver()
export class ShareDealQueryResolver {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
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
    @CurrentSession() session: Session,
  ): Promise<ShareDealResponse[]> {
    return pipe(
      this.userQueryRepositoryPort.findById(session.id),
      TE.map((user) => user.findAddress(input.addressKey)),
      TE.chainW((address) =>
        address
          ? TE.right(address)
          : TE.left(new NotFoundException('주소가 존재하지 않습니다.')),
      ),
      TE.map((address) => input.toCommand(address.coordinate)),
      TE.chainW((command) =>
        this.shareDealQueryRepositoryPort.findByNearest(command),
      ),
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
