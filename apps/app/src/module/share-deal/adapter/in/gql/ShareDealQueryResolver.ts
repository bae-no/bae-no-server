import { T, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@nestjs/common';
import { Args, ID, Int, Query, Resolver } from '@nestjs/graphql';

import { FindShareDealByNearestInput } from './input/FindShareDealByNearestInput';
import { FindShareDealInput } from './input/FindShareDealInput';
import { FindShareDealStatusInput } from './input/FindShareDealStatusInput';
import { ShareDealDetailResponse } from './response/ShareDealDetailResponse';
import { ShareDealResponse } from './response/ShareDealResponse';
import { ShareDealStatusResponse } from './response/ShareDealStatusResponse';
import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { UserQueryRepositoryPort } from '../../../../user/application/port/out/UserQueryRepositoryPort';
import { ShareDealAccessDeniedException } from '../../../application/port/in/exception/ShareDealAccessDeniedException';
import { ShareDealQueryRepositoryPort } from '../../../application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealId } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';

@Resolver()
export class ShareDealQueryResolver {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
  ) {}

  @Query(() => ShareDealResponse, { description: '공유딜 목록' })
  shareDeals(
    @Args('input') input: FindShareDealInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError, ShareDealResponse> {
    return pipe(
      input.toCommand(),
      (command) =>
        T.structPar({
          items: this.shareDealQueryRepositoryPort.find(command),
          total: this.shareDealQueryRepositoryPort.count(command),
        }),
      T.map(({ items, total }) =>
        ShareDealResponse.of(items, total, session.id),
      ),
    );
  }

  @Query(() => ShareDealResponse, {
    description: '공유딜 목록 (가까운 순)',
  })
  shareDealsByNearest(
    @Args('input') input: FindShareDealByNearestInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError | NotFoundException, ShareDealResponse> {
    return pipe(
      this.userQueryRepositoryPort.findById(session.id),
      T.map((user) => user.findAddress(input.addressKey)),
      T.chain((address) =>
        address
          ? T.succeed(address)
          : T.fail(new NotFoundException('주소가 존재하지 않습니다.')),
      ),
      T.map((address) => input.toCommand(address.coordinate)),
      T.chain((command) =>
        T.structPar({
          items: this.shareDealQueryRepositoryPort.findByNearest(command),
          total: this.shareDealQueryRepositoryPort.count(command),
        }),
      ),
      T.map(({ items, total }) =>
        ShareDealResponse.of(items, total, session.id),
      ),
    );
  }

  @Query(() => Int, { description: '내가 참여완료한 공유딜 개수' })
  myEndDealCount(@CurrentSession() session: Session): T.IO<DBError, number> {
    return this.shareDealQueryRepositoryPort.countByStatus(
      session.id,
      ShareDealStatus.END,
    );
  }

  @Query(() => ShareDealStatusResponse, { description: '공유딜 상태보기' })
  shareDealStatus(
    @Args('input') input: FindShareDealStatusInput,
    @CurrentSession() session: Session,
  ): T.IO<
    DBError | NotFoundException | ShareDealAccessDeniedException,
    ShareDealStatusResponse
  > {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(input.shareDealId),
      T.filterOrElse(
        (shareDeal) => shareDeal.participantInfo.hasId(session.id),
        () =>
          T.fail(
            new ShareDealAccessDeniedException('공유딜 참여자가 아닙니다.'),
          ),
      ),
      T.chain((shareDeal) =>
        T.structPar({
          shareDeal: T.succeed(shareDeal),
          users: this.userQueryRepositoryPort.findByIds(
            shareDeal.participantInfo.ids,
          ),
        }),
      ),
      T.map(({ shareDeal, users }) =>
        ShareDealStatusResponse.of(shareDeal, users, session.id),
      ),
    );
  }

  @Query(() => ShareDealDetailResponse, { description: '공유딜 상세보기' })
  shareDeal(
    @Args('id', { type: () => ID }) id: ShareDealId,
  ): T.IO<DBError, ShareDealDetailResponse> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(id),
      T.map(ShareDealDetailResponse.of),
    );
  }
}
