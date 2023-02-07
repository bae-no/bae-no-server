import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { ChatQueryResolver } from '../../../src/module/chat/adapter/in/gql/ChatQueryResolver';
import { FindChatDetailInput } from '../../../src/module/chat/adapter/in/gql/input/FindChatDetailInput';
import { FindChatInput } from '../../../src/module/chat/adapter/in/gql/input/FindChatInput';
import { ChatQueryUseCase } from '../../../src/module/chat/application/port/in/ChatQueryUseCase';
import { FindByUserDto } from '../../../src/module/chat/application/port/in/dto/FindByUserDto';
import { FindChatResult } from '../../../src/module/chat/application/port/in/dto/FindChatResult';
import { ChatId } from '../../../src/module/chat/domain/Chat';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { UserId } from '../../../src/module/user/domain/User';
import { ChatFactory } from '../../fixture/ChatFactory';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { UserFactory } from '../../fixture/UserFactory';
import { gql } from '../../fixture/utils';

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

      const query = gql`
        query chats($input: FindChatInput!) {
          chats(input: $input) {
            id
            title
            thumbnail
            lastContent
            unreadCount
          }
        }
      `;
      const chatResult = new FindChatResult(
        ShareDealId('id'),
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

  describe('chatDetail', () => {
    it('채팅방 상세정보를 가져온다', async () => {
      // given
      const query = gql`
        query chatDetail($input: FindChatDetailInput!) {
          chatDetail(input: $input) {
            id
            authorName
            content
            type
            writtenByMe
          }
        }
      `;
      const chatByUserDto = new FindByUserDto(
        ChatFactory.create({
          id: ChatId('id'),
          message: Message.normal(UserId('id'), 'content', true),
        }),
        UserFactory.create({ id: UserId('id'), nickname: 'nickname' }),
      );

      chatQueryUseCase.findByUser.mockReturnValue(right([chatByUserDto]));

      const input = new FindChatDetailInput();
      input.shareDealId = ShareDealId('shareDealId');
      input.cursor = '123';
      input.size = 10;

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "chatDetail": [
              {
                "authorName": "nickname",
                "content": "content",
                "id": "id",
                "type": "NORMAL",
                "writtenByMe": false,
              },
            ],
          },
        }
      `);
    });
  });
});
