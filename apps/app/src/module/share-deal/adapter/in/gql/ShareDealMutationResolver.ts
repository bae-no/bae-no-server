import { T, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { EndShareDealInput } from './input/EndShareDealInput';
import { JoinShareDealInput } from './input/JoinShareDealInput';
import { LeaveShareDealInput } from './input/LeaveShareDealInput';
import { OpenShareDealInput } from './input/OpenShareDealInput';
import { StartShareDealInput } from './input/StartShareDealInput';
import { UpdateShareDealInput } from './input/UpdateShareDealInput';
import { OpenShareDealResponse } from './response/OpenShareDealResponse';
import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import type {
  EndShareDealError,
  JoinShareDealError,
  LeaveShareDealError,
  StartShareDealError,
  UpdateShareDealError,
} from '../../../application/port/in/ShareDealCommandUseCase';
import { ShareDealCommandUseCase } from '../../../application/port/in/ShareDealCommandUseCase';

@Resolver()
export class ShareDealMutationResolver {
  constructor(
    private readonly shareDealCommandUseCase: ShareDealCommandUseCase,
  ) {}

  @Mutation(() => OpenShareDealResponse, { description: '공유딜 생성하기' })
  openShareDeal(
    @Args('input') input: OpenShareDealInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError, OpenShareDealResponse> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.open(command),
      T.map(OpenShareDealResponse.of),
    );
  }

  @Mutation(() => Boolean, { description: '공유딜 참여하기' })
  joinShareDeal(
    @Args('input') input: JoinShareDealInput,
    @CurrentSession() session: Session,
  ): T.IO<JoinShareDealError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.join(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '공유딜 시작하기' })
  startShareDeal(
    @Args('input') input: StartShareDealInput,
    @CurrentSession() session: Session,
  ): T.IO<StartShareDealError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.start(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '공유딜 종료하기' })
  endShareDeal(
    @Args('input') input: EndShareDealInput,
    @CurrentSession() session: Session,
  ): T.IO<EndShareDealError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.end(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '공유딜 수정하기' })
  updateShareDeal(
    @Args('input') input: UpdateShareDealInput,
    @CurrentSession() session: Session,
  ): T.IO<UpdateShareDealError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.update(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '공유딜 나가기' })
  leaveShareDeal(
    @Args('input') input: LeaveShareDealInput,
    @CurrentSession() session: Session,
  ): T.IO<LeaveShareDealError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.leave(command),
      T.map(() => true),
    );
  }
}
