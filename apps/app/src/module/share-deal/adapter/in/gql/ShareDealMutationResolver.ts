import { toResponse } from '@app/custom/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ShareDealCommandUseCase } from '../../../application/port/in/ShareDealCommandUseCase';
import { EndShareDealInput } from './input/EndShareDealInput';
import { JoinShareDealInput } from './input/JoinShareDealInput';
import { OpenShareDealInput } from './input/OpenShareDealInput';
import { StartShareDealInput } from './input/StartShareDealInput';

@Resolver()
export class ShareDealMutationResolver {
  constructor(
    private readonly shareDealCommandUseCase: ShareDealCommandUseCase,
  ) {}

  @Mutation(() => Boolean, { description: '공유딜 생성하기' })
  async openShareDeal(
    @Args('input') input: OpenShareDealInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.open(command),
      toResponse(constTrue),
    )();
  }

  @Mutation(() => Boolean, { description: '공유딜 참여하기' })
  async joinShareDeal(
    @Args('input') input: JoinShareDealInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.join(command),
      toResponse(constTrue),
    )();
  }

  @Mutation(() => Boolean, { description: '공유딜 시작하기' })
  async startShareDeal(
    @Args('input') input: StartShareDealInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.start(command),
      toResponse(constTrue),
    )();
  }

  @Mutation(() => Boolean, { description: '공유딜 종료하기' })
  async endShareDeal(
    @Args('input') input: EndShareDealInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.shareDealCommandUseCase.end(command),
      toResponse(constTrue),
    )();
  }
}
