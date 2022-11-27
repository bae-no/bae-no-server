import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { StubPubSub } from '../../../../../libs/pub-sub/test/fixture/StubPubSubModule';
import { ChatWrittenResponse } from '../../../src/module/chat/adapter/in/gql/response/ChatWrittenResponse';
import { ChatEventListener } from '../../../src/module/chat/adapter/in/listener/ChatEventListener';
import { ChatWrittenTrigger } from '../../../src/module/chat/adapter/in/listener/ChatWritttenTrigger';
import { ChatRepositoryPort } from '../../../src/module/chat/application/port/out/ChatRepositoryPort';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealEndedEvent } from '../../../src/module/share-deal/domain/event/ShareDealEndedEvent';
import { ShareDealStartedEvent } from '../../../src/module/share-deal/domain/event/ShareDealStartedEvent';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ChatFactory } from '../../fixture/ChatFactory';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ChatEventListener', () => {
  const pubSubPort = new StubPubSub();
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const chatRepositoryPort = mock<ChatRepositoryPort>();
  const eventEmitter = new StubEventEmitter();
  const chatEventListener = new ChatEventListener(
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

  describe('handle', () => {
    it('채팅 작성 메시지를 전송한다', () => {
      // given
      const chat = ChatFactory.create();
      const event = new ChatWrittenEvent([chat]);

      // when
      chatEventListener.handleChatWrittenEvent(event);

      // then
      expect(
        pubSubPort.get(ChatWrittenTrigger(chat.shareDealId)),
      ).toStrictEqual(ChatWrittenResponse.of(chat.message));
    });
  });

  describe('handleShareDealUpdatedEvent', () => {
    it('공유딜 시작 이벤트를 처리한다', async () => {
      // given
      const shareDealId = '1234';
      const now = new Date('2021-01-01');
      const shareDeal = ShareDealFactory.create({
        id: shareDealId,
        ownerId: 'ownerId',
        participantInfo: ParticipantInfo.of(['participantId'], 3),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));
      chatRepositoryPort.create.mockImplementation((value) => right(value));

      const event = new ShareDealStartedEvent(shareDealId, now);

      // when
      await chatEventListener.handleShareDealUpdatedEvent(event);

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
              "timestamp": 1609459200000,
              "userId": "participantId",
            },
          },
        ]
      `);
    });

    it('공유딜 종료 이벤트를 처리한다', async () => {
      // given
      const shareDealId = '1234';
      const now = new Date('2022-10-10');
      const shareDeal = ShareDealFactory.create({
        id: shareDealId,
        ownerId: 'ownerId',
        participantInfo: ParticipantInfo.of(['participantId'], 3),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));
      chatRepositoryPort.create.mockImplementation((value) => right(value));

      const event = new ShareDealEndedEvent(shareDealId, now);

      // when
      await chatEventListener.handleShareDealUpdatedEvent(event);

      // then
      expect(eventEmitter.get(ChatWrittenEvent.EVENT_NAME))
        .toMatchInlineSnapshot(`
        [
          Chat {
            "props": {
              "message": Message {
                "authorId": "ownerId",
                "content": "공유딜이 종료되었습니다.
        더이상의 채팅은 불가합니다.",
                "type": "NOTICE",
                "unread": false,
              },
              "shareDealId": "1234",
              "timestamp": 1665360000000,
              "userId": "participantId",
            },
          },
        ]
      `);
    });
  });
});
