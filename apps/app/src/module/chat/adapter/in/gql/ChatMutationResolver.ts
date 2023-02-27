import { T, pipe } from '@app/custom/effect';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { WriteChatInput } from './input/WriteChatInput';
import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import type { WriteChatError } from '../../../application/port/in/ChatCommandUseCase';
import { ChatCommandUseCase } from '../../../application/port/in/ChatCommandUseCase';

@Resolver()
export class ChatMutationResolver {
  constructor(private readonly chatCommandUseCase: ChatCommandUseCase) {}

  @Mutation(() => Boolean, { description: '채팅 입력하기' })
  writeChat(
    @Args('input') input: WriteChatInput,
    @CurrentSession() session: Session,
  ): T.IO<WriteChatError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.chatCommandUseCase.write(command),
      T.map(() => true),
    );
  }
}
