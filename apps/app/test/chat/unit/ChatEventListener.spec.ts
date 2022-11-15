import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { StubPubSub } from '../../../../../libs/pub-sub/test/fixture/StubPubSubModule';
import { ChatEventListener } from '../../../src/module/chat/adapter/in/listener/ChatEventListener';
import { ChatRepositoryPort } from '../../../src/module/chat/application/port/out/ChatRepositoryPort';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStartedEvent } from '../../../src/module/share-deal/domain/event/ShareDealStartedEvent';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ChatEventListener', () => {
  const pubSubPort = new StubPubSub();
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const chatRepositoryPort = mock<ChatRepositoryPort>();
  const eventEmitter = new StubEventEmitter();
  const shareDealCommandService = new ChatEventListener(
    pubSubPort,
    shareDealQueryRepositoryPort,
    chatRepositoryPort,
    eventEmitter,
  );

  beforeEach(() => {
    pubSubPort.clear();
    mockReset(shareDealQueryRepositoryPort);
    mockReset(chatRepositoryPort);
  });

  describe('handleShareDealStartedEvent', () => {
    it('공유딜 시작 이벤트를 처리한다', async () => {
      // given
      const shareDealId = '1234';
      const shareDeal = ShareDealFactory.create({
        id: shareDealId,
        ownerId: 'ownerId',
        participantInfo: ParticipantInfo.of(['participantId'], 3),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));
      chatRepositoryPort.create.mockImplementation((value) => right(value));

      const event = new ShareDealStartedEvent(shareDealId);

      // when
      await shareDealCommandService.handleShareDealStartedEvent(event);

      // then
      expect(eventEmitter.get(ChatWrittenEvent.EVENT_NAME))
        .toMatchInlineSnapshot(`
        [
          Chat {
            "props": {
              "message": Message {
                "authorId": "ownerId",
                "content": "공유딜이 시작되었습니다.
        공유딜 종료 전까지 나가기가 불가합니다.
        배달비 송금, 배달 음식 주문 및 공유까지 마무리된 후 공유딜을 종료해주세요:)
        맛있는 공유딜이 되길 바라요!",
                "type": "NOTICE",
                "unread": false,
              },
              "shareDealId": "1234",
              "userId": "participantId",
            },
          },
        ]
      `);
    });
  });
});
