import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { ChatMutationResolver } from '../../../src/module/chat/adapter/in/gql/ChatMutationResolver';
import { WriteChatInput } from '../../../src/module/chat/adapter/in/gql/input/WriteChatInput';
import { ChatCommandUseCase } from '../../../src/module/chat/application/port/in/ChatCommandUseCase';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';

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
      input.shareDealId = faker.database.mongodbObjectId();
      input.content = 'test';

      // language=GraphQL
      const mutation = `mutation writeChat($input: WriteChatInput!) {
        writeChat(input: $input)
      }`;

      chatCommandUseCase.write.mockReturnValue(right(undefined));

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
