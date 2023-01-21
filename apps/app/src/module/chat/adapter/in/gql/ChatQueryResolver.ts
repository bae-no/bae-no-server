import { toResponseArray } from '@app/custom/fp-ts';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { FindChatDetailInput } from './input/FindChatDetailInput';
import { FindChatInput } from './input/FindChatInput';
import { ChatDetailResponse } from './response/ChatDetailResponse';
import { ChatResponse } from './response/ChatResponse';
import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ChatQueryUseCase } from '../../../application/port/in/ChatQueryUseCase';

@Resolver()
export class ChatQueryResolver {
  constructor(private readonly chatQueryUseCase: ChatQueryUseCase) {}

  @Query(() => [ChatResponse], { description: '채팅방 목록' })
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

  @Query(() => [ChatDetailResponse], { description: '채팅방 상세' })
  async chatDetail(
    @Args('input') input: FindChatDetailInput,
    @CurrentSession() session: Session,
  ): Promise<ChatDetailResponse[]> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.chatQueryUseCase.findByUser(command),
      toResponseArray((dto) => ChatDetailResponse.of(dto, session.id)),
    )();
  }
}
