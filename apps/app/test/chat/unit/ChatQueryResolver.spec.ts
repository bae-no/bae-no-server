import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { ChatQueryResolver } from '../../../src/module/chat/adapter/in/gql/ChatQueryResolver';
import { FindChatInput } from '../../../src/module/chat/adapter/in/gql/input/FindChatInput';
import { ChatQueryUseCase } from '../../../src/module/chat/application/port/in/ChatQueryUseCase';
import { FindChatResult } from '../../../src/module/chat/application/port/in/dto/FindChatResult';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';

describe('ChatQueryResolver', () => {
  const chatQueryUseCase = mock<ChatQueryUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        ChatQueryResolver,
        {
          provide: ChatQueryUseCase,
          useValue: chatQueryUseCase,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  beforeEach(() => mockReset(chatQueryUseCase));

  describe('chats', () => {
    it('채팅방 목록을 가져온다', async () => {
      // given
      const input = new FindChatInput();
      input.status = ShareDealStatus.START;
      input.page = 1;
      input.size = 10;

      // language=GraphQL
      const query = `mutation chats($input: FindChatInput!) {
        chats(input: $input) {
          id
          title
          thumbnail
          lastContent
          unreadCount
        }
      }`;
      const chatResult = new FindChatResult(
        'id',
        'title',
        'thumbnail',
        'lastContent',
        1,
      );

      chatQueryUseCase.find.mockReturnValue(right([chatResult]));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "chats": [
              {
                "id": "id",
                "lastContent": "lastContent",
                "thumbnail": "thumbnail",
                "title": "title",
                "unreadCount": 1,
              },
            ],
          },
        }
      `);
    });
  });
});
