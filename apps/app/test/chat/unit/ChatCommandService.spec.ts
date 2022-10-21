import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { WriteChatCommand } from '../../../src/module/chat/application/port/in/dto/WriteChatCommand';
import { ChatRepositoryPort } from '../../../src/module/chat/application/port/out/ChatRepositoryPort';
import { ChatCommandService } from '../../../src/module/chat/application/service/ChatCommandService';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import { ShareDealAccessDeniedException } from '../../../src/module/share-deal/application/port/in/exception/ShareDealAccessDeniedException';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ChatCommandService', () => {
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const chatRepositoryPort = mock<ChatRepositoryPort>();
  const eventEmitter = new StubEventEmitter();
  const shareDealCommandService = new ChatCommandService(
    shareDealQueryRepositoryPort,
    chatRepositoryPort,
    eventEmitter,
  );

  beforeEach(() => {
    mockReset(shareDealQueryRepositoryPort);
    mockReset(chatRepositoryPort);
    eventEmitter.clear();
  });

  describe('write', () => {
    it('공유딜 권한이 없으면 에러가 발생한다', async () => {
      // given
      const command = new WriteChatCommand('userId', 'shareDealId', 'content');
      const shareDeal = ShareDealFactory.create();

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesLeft(result, (exception) => {
        expect(exception).toBeInstanceOf(ShareDealAccessDeniedException);
      });
    });

    it('참여자에게 모두 채팅을 추가한다', async () => {
      // given
      const command = new WriteChatCommand('user 1', 'shareDealId', 'content');
      const participantInfo = ParticipantInfo.of(
        ['user 1', 'user 2', 'user 3'],
        5,
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        participantInfo,
      });
      let db: Chat[] = [];

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));
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
              },
            ],
            [
              "user 2",
              Message {
                "authorId": "user 1",
                "content": "content",
                "type": "NORMAL",
              },
            ],
            [
              "user 3",
              Message {
                "authorId": "user 1",
                "content": "content",
                "type": "NORMAL",
              },
            ],
          ]
        `);
      });
    });

    it('채팅 작성 이벤트를 발송한다', async () => {
      // given
      const command = new WriteChatCommand('user 1', 'shareDealId', 'content');
      const participantInfo = ParticipantInfo.of(
        ['user 1', 'user 2', 'user 3'],
        5,
      );
      const shareDeal = ShareDealFactory.create({
        id: 'shareDealId',
        status: ShareDealStatus.START,
        participantInfo,
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));
      chatRepositoryPort.create.mockImplementation((chats) => right(chats));

      // when
      const result = shareDealCommandService.write(command);

      // then
      await assertResolvesRight(result, () => {
        expect(eventEmitter.get(ChatWrittenEvent.EVENT_NAME)).toBeInstanceOf(
          Chat,
        );
      });
    });
  });
});
