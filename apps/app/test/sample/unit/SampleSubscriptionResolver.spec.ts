import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { PubSubAdapter } from '@app/pub-sub/PubSubAdapter';
import type { INestApplication } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { createClient } from 'graphql-ws';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';
import WebSocket from 'ws';

import { SampleResponse } from '../../../src/module/sample/adapter/in/gql/response/SampleResponse';
import { SampleSubscriptionResolver } from '../../../src/module/sample/adapter/in/gql/SampleSubscriptionResolver';
import { SampleId } from '../../../src/module/sample/domain/Sample';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

describe('SampleSubscriptionResolver', () => {
  const pubSubAdapter = new PubSubAdapter(new PubSub());
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        SampleSubscriptionResolver,
        {
          provide: PubSubPort,
          useValue: pubSubAdapter,
        },
      ],
    });

    await app.listen(0);
  });

  afterAll(async () => app.close());

  describe('sampleAdded', () => {
    it('샘플 추가 이벤트를 구독한다', async () => {
      // given
      const subscription = gql`
        subscription sampleAdded {
          sampleAdded {
            id
            email
            name
          }
        }
      `;
      const client = createClient({
        webSocketImpl: WebSocket,
        url: `ws://localhost:${app.getHttpServer().address().port}/graphql`,
      });
      const sample = new SampleResponse();
      sample.id = SampleId('id');
      sample.email = 'email';
      sample.name = 'test';
      const timer = setInterval(() => {
        pubSubAdapter.publish('sampleAdded', sample);
      }, 10);

      // when
      const response = await new Promise<any>((resolve, reject) => {
        const cleanUp = client.subscribe(
          { query: subscription },
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
            "sampleAdded": {
              "email": "email",
              "id": "id",
              "name": "test",
            },
          },
        }
      `);
    });
  });
});
