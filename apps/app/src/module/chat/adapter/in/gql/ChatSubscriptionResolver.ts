import { pipe, T } from '@app/custom/effect';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { liveTracer } from '@app/monitoring/init';
import { Args, ID, Resolver, Subscription } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

import { ChatWrittenResponse } from './response/ChatWrittenResponse';
import { ShareDealQueryUseCase } from '../../../../share-deal/application/port/in/ShareDealQueryUseCase';
import { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
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
    resolve: (payload, _args, context) =>
      plainToInstance(ChatWrittenResponse, payload).enrichUserFields(
        context.req.user.id,
      ),
  })
  async chatWritten(
    @Args({ name: 'shareDealId', type: () => ID }) shareDealId: ShareDealId,
    @CurrentSession() session: Session,
  ): Promise<AsyncIterator<ChatWrittenResponse>> {
    return pipe(
      this.shareDealQueryUseCase.isParticipant(shareDealId, session.id),
      T.map(() =>
        this.pubSubPort.subscribe<ChatWrittenResponse>(
          ChatWrittenTrigger(shareDealId),
        ),
      ),
      liveTracer,
      T.runPromise,
    );
  }
}
