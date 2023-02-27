import { T, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import { Args, Query, Resolver } from '@nestjs/graphql';

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
  chats(
    @Args('input') input: FindChatInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError, ChatResponse[]> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.chatQueryUseCase.find(command),
      T.map((chats) => chats.map(ChatResponse.of)),
    );
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
