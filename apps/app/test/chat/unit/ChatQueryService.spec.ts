import { T, O } from '@app/custom/effect';
import { mock, mockReset } from 'jest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { FindChatByUserCommand } from '../../../src/module/chat/application/port/in/dto/FindChatByUserCommand';
import { FindChatCommand } from '../../../src/module/chat/application/port/in/dto/FindChatCommand';
import type { ChatQueryRepositoryPort } from '../../../src/module/chat/application/port/out/ChatQueryRepositoryPort';
import { ChatQueryService } from '../../../src/module/chat/application/service/ChatQueryService';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { ChatReadEvent } from '../../../src/module/chat/domain/event/ChatReadEvent';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import type { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import type { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import { UserId } from '../../../src/module/user/domain/User';
import { ChatFactory } from '../../fixture/ChatFactory';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { UserFactory } from '../../fixture/UserFactory';
import { assertResolvesSuccess } from '../../fixture/utils';

describe('ChatQueryService', () => {
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const chatQueryRepositoryPort = mock<ChatQueryRepositoryPort>();
  const userQueryRepositoryPort = mock<UserQueryRepositoryPort>();
  const eventEmitter = new StubEventEmitter();
  const shareDealCommandService = new ChatQueryService(
    shareDealQueryRepositoryPort,
    chatQueryRepositoryPort,
    userQueryRepositoryPort,
    eventEmitter,
  );

  beforeEach(() => {
    mockReset(shareDealQueryRepositoryPort);
    mockReset(chatQueryRepositoryPort);
    mockReset(userQueryRepositoryPort);
    eventEmitter.clear();
  });

  describe('find', () => {
    it('채팅방 목록을 조회한다.', async () => {
      // given
      const shareDeals = ['1', '2'].map((id) =>
        ShareDealFactory.create({
          id: ShareDealId(id),
          title: `shareDeal${id}`,
          thumbnail: `https://baeno${id}.com`,
        }),
      );
      const unreadCounts = [10, 20];
      const chats = shareDeals.map((deal) =>
        Chat.of({
          shareDealId: deal.id,
          userId: UserId('userId'),
          orderedKey: 'orderedKey',
          message: Message.normal(UserId('123'), 'content', true),
        }),
      );

      chatQueryRepositoryPort.last
        .mockReturnValueOnce(T.succeed(O.some(chats[0])))
        .mockReturnValueOnce(T.succeed(O.some(chats[1])));
      chatQueryRepositoryPort.unreadCount
        .mockReturnValueOnce(T.succeed(unreadCounts[1]))
        .mockReturnValueOnce(T.succeed(unreadCounts[0]));
      shareDealQueryRepositoryPort.findByUser.mockReturnValue(
        T.succeed(shareDeals),
      );

      const command = new FindChatCommand(
        UserId('userId'),
        ShareDealStatus.START,
        1,
        10,
      );

      // when
      const result = shareDealCommandService.find(command);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value).toMatchInlineSnapshot(`
          [
            FindChatResult {
              "id": "1",
              "lastChat": Some {
                "_tag": "Some",
                "value": Chat {
                  "props": {
                    "message": Message {
                      "authorId": "123",
                      "content": "content",
                      "type": "NORMAL",
                      "unread": true,
                    },
                    "orderedKey": "orderedKey",
                    "shareDealId": "1",
                    "userId": "userId",
                  },
                },
              },
              "thumbnail": "https://baeno1.com",
              "title": "shareDeal1",
              "unreadCount": 20,
            },
            FindChatResult {
              "id": "2",
              "lastChat": Some {
                "_tag": "Some",
                "value": Chat {
                  "props": {
                    "message": Message {
                      "authorId": "123",
                      "content": "content",
                      "type": "NORMAL",
                      "unread": true,
                    },
                    "orderedKey": "orderedKey",
                    "shareDealId": "2",
                    "userId": "userId",
                  },
                },
              },
              "thumbnail": "https://baeno2.com",
              "title": "shareDeal2",
              "unreadCount": 10,
            },
          ]
        `);
      });
    });
  });

  describe('findByUser', () => {
    it('채팅방 조회 이벤트를 발송한다', async () => {
      // given
      chatQueryRepositoryPort.findByUser.mockReturnValue(T.succeed([]));
      userQueryRepositoryPort.findByIds.mockReturnValue(T.succeed([]));

      const command = new FindChatByUserCommand(
        ShareDealId('shareDealId'),
        UserId('userId'),
      );

      // when
      const result = shareDealCommandService.findByUser(command);

      // then
      await assertResolvesSuccess(result, () => {
        const event = eventEmitter.get(ChatReadEvent.name) as ChatReadEvent;
        expect(event.shareDealId).toBe('shareDealId');
        expect(event.userId).toBe('userId');
      });
    });

    it('채팅방 상세정보를 가져온다', async () => {
      // given
      const user = UserFactory.create();
      const chat = ChatFactory.create({
        message: Message.normal(user.id, 'content', true),
      });
      chatQueryRepositoryPort.findByUser.mockReturnValue(T.succeed([chat]));
      userQueryRepositoryPort.findByIds.mockReturnValue(T.succeed([user]));

      const command = new FindChatByUserCommand(
        ShareDealId('shareDealId'),
        UserId('userId'),
      );

      // when
      const result = shareDealCommandService.findByUser(command);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value).toHaveLength(1);
        expect(value[0].chat).toBe(chat);
        expect(value[0].author).toBe(user);
      });
    });
  });
});
