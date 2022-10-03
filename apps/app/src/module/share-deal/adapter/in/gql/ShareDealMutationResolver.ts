import { toResponse } from '@app/custom/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ShareDealCommandUseCase } from '../../../application/port/in/ShareDealCommandUseCase';
import { OpenShareDealInput } from './input/OpenShareDealInput';

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
}
