import type { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { left, right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { WriteChatCommand } from '../../../src/module/chat/application/port/in/dto/WriteChatCommand';
import type { ChatRepositoryPort } from '../../../src/module/chat/application/port/out/ChatRepositoryPort';
import { ChatCommandService } from '../../../src/module/chat/application/service/ChatCommandService';
import type { Chat } from '../../../src/module/chat/domain/Chat';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import { ShareDealAccessDeniedException } from '../../../src/module/share-deal/application/port/in/exception/ShareDealAccessDeniedException';
import type { ShareDealQueryUseCase } from '../../../src/module/share-deal/application/port/in/ShareDealQueryUseCase';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { UserId } from '../../../src/module/user/domain/User';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture/utils';

describe('ChatCommandService', () => {
  const shareDealQueryUseCase = mock<ShareDealQueryUseCase>();
  const chatRepositoryPort = mock<ChatRepositoryPort>();
  const eventEmitter = new StubEventEmitter();
  const ticketGeneratorPort = mock<TicketGeneratorPort>();
  const shareDealCommandService = new ChatCommandService(
    shareDealQueryUseCase,
    chatRepositoryPort,
    eventEmitter,
    ticketGeneratorPort,
  );

  beforeEach(() => {
    mockReset(shareDealQueryUseCase);
    mockReset(chatRepositoryPort);
    mockReset(ticketGeneratorPort);
    eventEmitter.clear();
  });

  describe('write', () => {
    it('공유딜 권한이 없으면 에러가 발생한다', async () => {
      // given
      const command = new WriteChatCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
        'content',
      );

      shareDealQueryUseCase.participantIds.mockReturnValue(
        left(new ShareDealAccessDeniedException('error')),
      );

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesLeft(result, (exception) => {
        expect(exception).toBeInstanceOf(ShareDealAccessDeniedException);
      });
    });

    it('참여자에게 모두 채팅을 추가한다', async () => {
      // given
      const command = new WriteChatCommand(
        UserId('user 1'),
        ShareDealId('shareDealId'),
        'content',
      );
      let db: Chat[] = [];

      shareDealQueryUseCase.participantIds.mockReturnValue(
        right(['user 1', 'user 2', 'user 3'].map(UserId)),
      );
      chatRepositoryPort.create.mockImplementation((chats) => {
        db = chats;

        return right(chats);
      });

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesRight(result, () => {
        expect(db).toHaveLength(3);
        expect(db.map((chat) => [chat.userId, chat.message]))
          .toMatchInlineSnapshot(`
          [
            [
              "user 1",
              Message {
                "authorId": "user 1",
                "content": "content",
                "type": "NORMAL",
                "unread": false,
              },
            ],
            [
              "user 2",
              Message {
                "authorId": "user 1",
                "content": "content",
                "type": "NORMAL",
                "unread": true,
              },
            ],
            [
              "user 3",
              Message {
                "authorId": "user 1",
                "content": "content",
                "type": "NORMAL",
                "unread": true,
              },
            ],
          ]
        `);
      });
    });

    it('채팅 작성 이벤트를 발송한다', async () => {
      // given
      const command = new WriteChatCommand(
        UserId('user 1'),
        ShareDealId('shareDealId'),
        'content',
      );

      shareDealQueryUseCase.participantIds.mockReturnValue(
        right(['user 1', 'user 2', 'user 3'].map(UserId)),
      );
      chatRepositoryPort.create.mockImplementation((chats) => right(chats));

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesRight(result, () => {
        const event = eventEmitter.get(
          ChatWrittenEvent.name,
        ) as ChatWrittenEvent;
        expect(event.chats).toHaveLength(3);
      });
    });
  });
});
