import { T } from '@app/custom/effect';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { PubSubAdapter } from '@app/pub-sub/PubSubAdapter';
import type { INestApplication } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { createClient } from 'graphql-ws';
import { afterAll, beforeAll, describe, it, expect, beforeEach } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';
import WebSocket from 'ws';

import { ChatSubscriptionResolver } from '../../../src/module/chat/adapter/in/gql/ChatSubscriptionResolver';
import type { ChatWrittenPayload } from '../../../src/module/chat/adapter/in/listener/ChatWritttenTrigger';
import { ChatWrittenTrigger } from '../../../src/module/chat/adapter/in/listener/ChatWritttenTrigger';
import { ChatId } from '../../../src/module/chat/domain/Chat';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { ShareDealQueryUseCase } from '../../../src/module/share-deal/application/port/in/ShareDealQueryUseCase';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { UserId } from '../../../src/module/user/domain/User';
import { ChatFactory } from '../../fixture/ChatFactory';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { UserFactory } from '../../fixture/UserFactory';
import { gql } from '../../fixture/utils';

describe('ChatSubscriptionResolver', () => {
  const pubSubAdapter = new PubSubAdapter(new PubSub());
  const shareDealQueryUseCase = mock<ShareDealQueryUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        ChatSubscriptionResolver,
        {
          provide: PubSubPort,
          useValue: pubSubAdapter,
        },
        {
          provide: ShareDealQueryUseCase,
          useValue: shareDealQueryUseCase,
        },
      ],
    });

    setMockUser();
    await app.listen(0);
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockReset(shareDealQueryUseCase);
  });

  describe('chatWritten', () => {
    it('채팅 추가 이벤트를 구독한다', async () => {
      // given
      const subscription = gql`
        subscription chatWritten($shareDealId: ID!) {
          chatWritten(shareDealId: $shareDealId) {
            authorName
            content
            createdAt
            id
            orderedKey
            type
            unread
            writtenByMe
          }
        }
      `;
      const client = createClient({
        webSocketImpl: WebSocket,
        url: `ws://localhost:${app.getHttpServer().address().port}/graphql`,
      });
      const payload: ChatWrittenPayload = {
        chat: ChatFactory.create({
          id: ChatId('id'),
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          orderedKey: 'orderedKey',
          message: Message.normal(
            UserId('authorId'),
            'Dolorem velit eligendi culpa cumque delectus.',
            true,
          ),
        }),
        author: UserFactory.create({ nickname: 'nickname' }),
      };
      shareDealQueryUseCase.isParticipant.mockReturnValue(T.unit);
      const timer = setInterval(() => {
        pubSubAdapter.publish(ChatWrittenTrigger(ShareDealId('id')), payload);
      }, 10);

      // when
      const response = await new Promise<any>((resolve, reject) => {
        const cleanUp = client.subscribe(
          { query: subscription, variables: { shareDealId: 'id' } },
          {
            next: (data) => {
              resolve(data);
              clearInterval(timer);
              cleanUp();
            },
            error: (error) => reject(error),
            complete: () => resolve(undefined),
          },
        );
      });

      // then
      expect(response).toMatchInlineSnapshot(`
        {
          "data": {
            "chatWritten": {
              "authorName": "nickname",
              "content": "Dolorem velit eligendi culpa cumque delectus.",
              "createdAt": "2021-01-01T00:00:00.000Z",
              "id": "id",
              "orderedKey": "orderedKey",
              "type": "NORMAL",
              "unread": true,
              "writtenByMe": false,
            },
          },
        }
      `);
    });
  });
});
