import { toResponseArray } from '@app/custom/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ChatQueryUseCase } from '../../../application/port/in/ChatQueryUseCase';
import { FindChatInput } from './input/FindChatInput';
import { ChatResponse } from './response/ChatResponse';

@Resolver()
export class ChatQueryResolver {
  constructor(private readonly chatQueryUseCase: ChatQueryUseCase) {}

  @Mutation(() => [ChatResponse], { description: '채팅방 목록' })
  async chats(
    @Args('input') input: FindChatInput,
    @CurrentSession() session: Session,
  ): Promise<ChatResponse[]> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.chatQueryUseCase.find(command),
      toResponseArray(ChatResponse.of),
    )();
  }
}
