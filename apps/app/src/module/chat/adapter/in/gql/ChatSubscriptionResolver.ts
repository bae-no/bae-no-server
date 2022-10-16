import { TE } from '@app/custom/fp-ts';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Args, ID, Resolver, Subscription } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ChatQueryUseCase } from '../../../application/port/in/ChatQueryUseCase';
import { ChatWrittenResponse } from './response/ChatWrittenResponse';

@Resolver()
export class ChatSubscriptionResolver {
  constructor(
    private readonly pubSubPort: PubSubPort,
    private readonly chatQueryUseCase: ChatQueryUseCase,
  ) {}

  @Subscription(() => ChatWrittenResponse, {
    description: '채팅 작성 이벤트 구독하기',
  })
  async chatWritten(
    @Args({ name: 'shareDealId', type: () => ID }) shareDealId: string,
    @CurrentSession() session: Session,
  ): Promise<AsyncIterator<ChatWrittenResponse>> {
    return pipe(
      this.chatQueryUseCase.isParticipant(shareDealId, session.id),
      TE.map(() =>
        this.pubSubPort.subscribe<ChatWrittenResponse>(
          `chat.${shareDealId}.written`,
        ),
      ),
      TE.getOrElse((error) => {
        throw error;
      }),
    )();
  }
}
