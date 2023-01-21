import { TE } from '@app/custom/fp-ts';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Args, ID, Resolver, Subscription } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { ChatWrittenResponse } from './response/ChatWrittenResponse';
import { ShareDealQueryUseCase } from '../../../../share-deal/application/port/in/ShareDealQueryUseCase';
import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { ChatWrittenTrigger } from '../listener/ChatWritttenTrigger';

@Resolver()
export class ChatSubscriptionResolver {
  constructor(
    private readonly pubSubPort: PubSubPort,
    private readonly shareDealQueryUseCase: ShareDealQueryUseCase,
  ) {}

  @Subscription(() => ChatWrittenResponse, {
    description: '채팅 작성 이벤트 구독하기',
  })
  async chatWritten(
    @Args({ name: 'shareDealId', type: () => ID }) shareDealId: string,
    @CurrentSession() session: Session,
  ): Promise<AsyncIterator<ChatWrittenResponse>> {
    return pipe(
      this.shareDealQueryUseCase.isParticipant(shareDealId, session.id),
      TE.map(() =>
        this.pubSubPort.subscribe<ChatWrittenResponse>(
          ChatWrittenTrigger(shareDealId),
        ),
      ),
      TE.getOrElse((error) => {
        throw error;
      }),
    )();
  }
}
