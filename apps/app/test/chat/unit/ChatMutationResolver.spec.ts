import { T } from '@app/custom/effect';
import { faker } from '@faker-js/faker';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { ChatMutationResolver } from '../../../src/module/chat/adapter/in/gql/ChatMutationResolver';
import { WriteChatInput } from '../../../src/module/chat/adapter/in/gql/input/WriteChatInput';
import { ChatCommandUseCase } from '../../../src/module/chat/application/port/in/ChatCommandUseCase';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

describe('ChatMutationResolver', () => {
  const chatCommandUseCase = mock<ChatCommandUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        ChatMutationResolver,
        {
          provide: ChatCommandUseCase,
          useValue: chatCommandUseCase,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  beforeEach(() => mockReset(chatCommandUseCase));

  describe('writeChat', () => {
    it('채팅 입력에 성공한다', async () => {
      // given
      const input = new WriteChatInput();
      input.shareDealId = ShareDealId(faker.database.mongodbObjectId());
      input.content = 'test';

      const mutation = gql`
        mutation writeChat($input: WriteChatInput!) {
          writeChat(input: $input)
        }
      `;

      chatCommandUseCase.write.mockReturnValue(T.succeed(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "writeChat": true,
          },
        }
      `);
    });
  });
});
