import { TE, toResponse } from '@app/custom/fp-ts';
import { NotFoundException } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { identity, pipe } from 'fp-ts/function';

import { FindShareDealByNearestInput } from './input/FindShareDealByNearestInput';
import { FindShareDealInput } from './input/FindShareDealInput';
import { FindShareDealStatusInput } from './input/FindShareDealStatusInput';
import { ShareDealResponse } from './response/ShareDealResponse';
import { ShareDealStatusResponse } from './response/ShareDealStatusResponse';
import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { UserQueryRepositoryPort } from '../../../../user/application/port/out/UserQueryRepositoryPort';
import { ShareDealAccessDeniedException } from '../../../application/port/in/exception/ShareDealAccessDeniedException';
import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';

@Resolver()
export class ShareDealQueryResolver {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
  ) {}

  @Query(() => ShareDealResponse, { description: '공유딜 목록' })
  async shareDeals(
    @Args('input') input: FindShareDealInput,
  ): Promise<ShareDealResponse> {
    const command = input.toCommand();

    return pipe(
      TE.Do,
      TE.apS('items', this.shareDealQueryRepositoryPort.find(command)),
      TE.apS('total', this.shareDealQueryRepositoryPort.count(command)),
      toResponse(({ items, total }) => ShareDealResponse.of(items, total)),
    )();
  }

  @Query(() => ShareDealResponse, {
    description: '공유딜 목록 (가까운 순)',
  })
  async shareDealsByNearest(
    @Args('input') input: FindShareDealByNearestInput,
    @CurrentSession() session: Session,
  ): Promise<ShareDealResponse> {
    return pipe(
      this.userQueryRepositoryPort.findById(session.id),
      TE.map((user) => user.findAddress(input.addressKey)),
      TE.chainW((address) =>
        address
          ? TE.right(address)
          : TE.left(new NotFoundException('주소가 존재하지 않습니다.')),
      ),
      TE.map((address) => input.toCommand(address.coordinate)),
      TE.bindTo('command'),
      TE.bindW('items', ({ command }) =>
        this.shareDealQueryRepositoryPort.findByNearest(command),
      ),
      TE.bindW('total', ({ command }) =>
        this.shareDealQueryRepositoryPort.count(command),
      ),
      toResponse(({ items, total }) => ShareDealResponse.of(items, total)),
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

  @Query(() => ShareDealStatusResponse, { description: '공유딜 상태보기' })
  async shareDealStatus(
    @Args('input') input: FindShareDealStatusInput,
    @CurrentSession() session: Session,
  ): Promise<ShareDealStatusResponse> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(input.shareDealId),
      TE.filterOrElseW(
        (shareDeal) => shareDeal.participantInfo.hasId(session.id),
        () => new ShareDealAccessDeniedException('공유딜 참여자가 아닙니다.'),
      ),
      TE.bindTo('shareDeal'),
      TE.bind('users', ({ shareDeal }) =>
        this.userQueryRepositoryPort.findByIds(shareDeal.participantInfo.ids),
      ),
      toResponse(({ shareDeal, users }) =>
        ShareDealStatusResponse.of(shareDeal, users, session.id),
      ),
    )();
  }
}
