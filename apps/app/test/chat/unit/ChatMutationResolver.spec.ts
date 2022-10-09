import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { ChatMutationResolver } from '../../../src/module/chat/adapter/in/gql/ChatMutationResolver';
import { JoinChatInput } from '../../../src/module/chat/adapter/in/gql/input/JoinChatInput';
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

  describe('joinChat', () => {
    it('공유딜을 생성한다.', async () => {
      // given
      const input = new JoinChatInput();
      input.shareDealId = 'abcd1234';

      // language=GraphQL
      const mutation = `mutation joinChat($input: JoinChatInput!) {
        joinChat(input: $input)
      }`;

      chatCommandUseCase.join.mockReturnValue(right(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "joinChat": true,
          },
        }
      `);
    });
  });
});
