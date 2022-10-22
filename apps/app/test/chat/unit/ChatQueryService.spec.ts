import { some } from 'fp-ts/Option';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { FindChatCommand } from '../../../src/module/chat/application/port/in/dto/FindChatCommand';
import { ChatQueryRepositoryPort } from '../../../src/module/chat/application/port/out/ChatQueryRepositoryPort';
import { ChatQueryService } from '../../../src/module/chat/application/service/ChatQueryService';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { assertResolvesRight } from '../../fixture';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ChatQueryService', () => {
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const chatQueryRepositoryPort = mock<ChatQueryRepositoryPort>();
  const shareDealCommandService = new ChatQueryService(
    shareDealQueryRepositoryPort,
    chatQueryRepositoryPort,
  );

  beforeEach(() => {
    mockReset(shareDealQueryRepositoryPort);
    mockReset(chatQueryRepositoryPort);
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
});
