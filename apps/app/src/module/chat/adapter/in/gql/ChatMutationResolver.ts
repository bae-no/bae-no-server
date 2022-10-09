import { toResponse } from '@app/custom/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ChatCommandUseCase } from '../../../application/port/in/ChatCommandUseCase';
import { JoinChatInput } from './input/JoinChatInput';

@Resolver()
export class ChatMutationResolver {
  constructor(private readonly chatCommandUseCase: ChatCommandUseCase) {}

  @Mutation(() => Boolean, { description: '채팅방 참여하기' })
  async joinChat(
    @Args('input') input: JoinChatInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.chatCommandUseCase.join(command),
      toResponse(constTrue),
    )();
  }
}
