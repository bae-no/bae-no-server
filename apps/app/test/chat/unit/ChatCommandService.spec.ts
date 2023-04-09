import { T } from '@app/custom/effect';
import type { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { WriteChatCommand } from '../../../src/module/chat/application/port/in/dto/WriteChatCommand';
import type { ChatRepositoryPort } from '../../../src/module/chat/application/port/out/ChatRepositoryPort';
import { ChatCommandService } from '../../../src/module/chat/application/service/ChatCommandService';
import type { Chat } from '../../../src/module/chat/domain/Chat';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import { ShareDealAccessDeniedException } from '../../../src/module/share-deal/application/port/in/exception/ShareDealAccessDeniedException';
import type { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { UserId } from '../../../src/module/user/domain/User';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { assertResolvesFail, assertResolvesSuccess } from '../../fixture/utils';

describe('ChatCommandService', () => {
  const shareDealQueryQueryRepository = mock<ShareDealQueryRepositoryPort>();
  const chatRepositoryPort = mock<ChatRepositoryPort>();
  const eventEmitter = new StubEventEmitter();
  const ticketGeneratorPort = mock<TicketGeneratorPort>();
  const shareDealCommandService = new ChatCommandService(
    chatRepositoryPort,
    eventEmitter,
    ticketGeneratorPort,
    shareDealQueryQueryRepository,
  );

  beforeEach(() => {
    mockReset(chatRepositoryPort);
    mockReset(ticketGeneratorPort);
    mockReset(shareDealQueryQueryRepository);
    eventEmitter.clear();
  });

  describe('write', () => {
    it('채팅을 작성할 수 없는 공유딜이면 에러가 발생한다', async () => {
      // given
      const command = new WriteChatCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
        'content',
      );
      const shareDeal = ShareDealFactory.create({
        id: command.shareDealId,
        participantInfo: ParticipantInfo.of([command.userId], 5),
        status: ShareDealStatus.CLOSE,
      });

      shareDealQueryQueryRepository.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesFail(result, (exception) => {
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
      const shareDeal = ShareDealFactory.create({
        id: command.shareDealId,
        participantInfo: ParticipantInfo.of(
          ['user 1', 'user 2', 'user 3'].map(UserId),
          5,
        ),
        status: ShareDealStatus.START,
      });

      shareDealQueryQueryRepository.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      let db: Chat[] = [];
      chatRepositoryPort.create.mockImplementation((chats) => {
        db = chats;

        return T.succeed(chats);
      });

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesSuccess(result, () => {
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
      const shareDeal = ShareDealFactory.create({
        id: command.shareDealId,
        participantInfo: ParticipantInfo.of(
          ['user 1', 'user 2', 'user 3'].map(UserId),
          5,
        ),
        status: ShareDealStatus.START,
      });

      shareDealQueryQueryRepository.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      chatRepositoryPort.create.mockImplementation((chats) => T.succeed(chats));

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesSuccess(result, () => {
        const event = eventEmitter.get(
          ChatWrittenEvent.name,
        ) as ChatWrittenEvent;
        expect(event.chats).toHaveLength(3);
      });
    });
  });
});
