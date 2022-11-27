import { some } from 'fp-ts/Option';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { FindChatByUserCommand } from '../../../src/module/chat/application/port/in/dto/FindChatByUserCommand';
import { FindChatCommand } from '../../../src/module/chat/application/port/in/dto/FindChatCommand';
import { ChatQueryRepositoryPort } from '../../../src/module/chat/application/port/out/ChatQueryRepositoryPort';
import { ChatQueryService } from '../../../src/module/chat/application/service/ChatQueryService';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { ChatReadEvent } from '../../../src/module/chat/domain/event/ChatReadEvent';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import { ChatFactory } from '../../fixture/ChatFactory';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { UserFactory } from '../../fixture/UserFactory';
import { assertResolvesRight } from '../../fixture/utils';

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
          id,
          title: `shareDeal${id}`,
          thumbnail: `https://baeno${id}.com`,
        }),
      );
      const unreadCounts = [10, 20];
      const chats = shareDeals.map((deal) =>
        Chat.of({
          shareDealId: deal.id,
          userId: 'userId',
          message: Message.normal('123', 'content', true),
        }),
      );

      chatQueryRepositoryPort.last
        .mockReturnValueOnce(right(some(chats[0])))
        .mockReturnValueOnce(right(some(chats[1])));
      chatQueryRepositoryPort.unreadCount
        .mockReturnValueOnce(right(unreadCounts[1]))
        .mockReturnValueOnce(right(unreadCounts[0]));
      shareDealQueryRepositoryPort.findByUser.mockReturnValue(
        right(shareDeals),
      );

      const command = new FindChatCommand(
        'userId',
        ShareDealStatus.START,
        1,
        10,
      );

      // when
      const result = shareDealCommandService.find(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toMatchInlineSnapshot(`
          [
            FindChatResult {
              "id": "1",
              "lastContent": "content",
              "thumbnail": "https://baeno1.com",
              "title": "shareDeal1",
              "unreadCount": 20,
            },
            FindChatResult {
              "id": "2",
              "lastContent": "content",
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
      chatQueryRepositoryPort.findByUser.mockReturnValue(right([]));
      userQueryRepositoryPort.findByIds.mockReturnValue(right([]));

      const command = new FindChatByUserCommand('shareDealId', 'userId');

      // when
      const result = shareDealCommandService.findByUser(command);

      // then
      await assertResolvesRight(result, () => {
        expect(eventEmitter.get(ChatReadEvent.EVENT_NAME)).toStrictEqual(
          new ChatReadEvent('userId', 'shareDealId'),
        );
      });
    });

    it('채팅방 상세정보를 가져온다', async () => {
      // given
      const user = UserFactory.create();
      const chat = ChatFactory.create({
        message: Message.normal(user.id, 'content', true),
      });
      chatQueryRepositoryPort.findByUser.mockReturnValue(right([chat]));
      userQueryRepositoryPort.findByIds.mockReturnValue(right([user]));

      const command = new FindChatByUserCommand('shareDealId', 'userId');

      // when
      const result = shareDealCommandService.findByUser(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(1);
        expect(value[0].chat).toBe(chat);
        expect(value[0].author).toBe(user);
      });
    });
  });
});
