import { T } from '@app/custom/effect';
import { toResponseArray } from '@app/custom/fp-ts';
import type { DBError } from '@app/domain/error/DBError';
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
  chatDetail(
    @Args('input') input: FindChatDetailInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError, ChatDetailResponse[]> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.chatQueryUseCase.findByUser(command),
      T.map((dtoList) =>
        dtoList.map((dto) => ChatDetailResponse.of(dto, session.id)),
      ),
    );
  }
}
