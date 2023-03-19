import { T } from '@app/custom/effect';
import type { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { StubPubSub } from '../../../../../libs/pub-sub/test/fixture/StubPubSubModule';
import { ChatWrittenResponse } from '../../../src/module/chat/adapter/in/gql/response/ChatWrittenResponse';
import { ChatEventListener } from '../../../src/module/chat/adapter/in/listener/ChatEventListener';
import { ChatWrittenTrigger } from '../../../src/module/chat/adapter/in/listener/ChatWritttenTrigger';
import type { ChatRepositoryPort } from '../../../src/module/chat/application/port/out/ChatRepositoryPort';
import { ChatReadEvent } from '../../../src/module/chat/domain/event/ChatReadEvent';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import type { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealClosedEvent } from '../../../src/module/share-deal/domain/event/ShareDealClosedEvent';
import { ShareDealEndedEvent } from '../../../src/module/share-deal/domain/event/ShareDealEndedEvent';
import { ShareDealStartedEvent } from '../../../src/module/share-deal/domain/event/ShareDealStartedEvent';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { UserId } from '../../../src/module/user/domain/User';
import { ChatFactory } from '../../fixture/ChatFactory';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ChatEventListener', () => {
  const pubSubPort = new StubPubSub();
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const chatRepositoryPort = mock<ChatRepositoryPort>();
  const ticketGeneratorPort = mock<TicketGeneratorPort>();
  const eventEmitter = new StubEventEmitter();
  const chatEventListener = new ChatEventListener(
    pubSubPort,
    shareDealQueryRepositoryPort,
    chatRepositoryPort,
    eventEmitter,
    ticketGeneratorPort,
  );

  beforeEach(() => {
    pubSubPort.clear();
    mockReset(shareDealQueryRepositoryPort);
    mockReset(chatRepositoryPort);
    mockReset(ticketGeneratorPort);
  });

  describe('handleChatReadEvent', () => {
    it('채팅 작성 메시지를 전송한다', async () => {
      // given
      const userId = UserId('');
      const shareDealId = ShareDealId('');
      const event = new ChatReadEvent(userId, shareDealId);

      chatRepositoryPort.updateRead.mockReturnValue(T.unit);

      // when
      await chatEventListener.handleChatReadEvent(event);

      // then
      expect(chatRepositoryPort.updateRead).toBeCalled();
    });
  });

  describe('handleChatWrittenEvent', () => {
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
      const shareDealId = ShareDealId('1234');
      const shareDeal = ShareDealFactory.create({
        id: shareDealId,
        ownerId: UserId('ownerId'),
        participantInfo: ParticipantInfo.of(['participantId'].map(UserId), 3),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      ticketGeneratorPort.generateId.mockReturnValue('ticketId');
      chatRepositoryPort.create.mockImplementation((value) => T.succeed(value));

      const event = new ShareDealStartedEvent(shareDealId);

      // when
      await chatEventListener.handleShareDealUpdatedEvent(event);

      // then
      const result = eventEmitter.get(
        ChatWrittenEvent.name,
      ) as ChatWrittenEvent;
      expect(result.chats).toMatchInlineSnapshot(`
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
              "orderedKey": "ticketId",
              "shareDealId": "1234",
              "userId": "participantId",
            },
          },
        ]
      `);
    });

    it('공유딜 종료 이벤트를 처리한다', async () => {
      // given
      const shareDealId = ShareDealId('1234');
      const shareDeal = ShareDealFactory.create({
        id: shareDealId,
        ownerId: UserId('ownerId'),
        participantInfo: ParticipantInfo.of(['participantId'].map(UserId), 3),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      ticketGeneratorPort.generateId.mockReturnValue('ticketId');
      chatRepositoryPort.create.mockImplementation((value) => T.succeed(value));

      const event = new ShareDealEndedEvent(shareDealId);

      // when
      await chatEventListener.handleShareDealUpdatedEvent(event);

      // then
      const actual = eventEmitter.get(
        ChatWrittenEvent.name,
      ) as ChatWrittenEvent;
      expect(actual.chats).toMatchInlineSnapshot(`
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
              "orderedKey": "ticketId",
              "shareDealId": "1234",
              "userId": "participantId",
            },
          },
        ]
      `);
    });

    it('공유딜 파기 이벤트를 처리한다', async () => {
      // given
      const shareDealId = ShareDealId('1234');
      const shareDeal = ShareDealFactory.create({
        id: shareDealId,
        ownerId: UserId('ownerId'),
        participantInfo: ParticipantInfo.of(['participantId'].map(UserId), 3),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      ticketGeneratorPort.generateId.mockReturnValue('ticketId');
      chatRepositoryPort.create.mockImplementation((value) => T.succeed(value));

      const event = new ShareDealClosedEvent(shareDealId);

      // when
      await chatEventListener.handleShareDealUpdatedEvent(event);

      // then
      const actual = eventEmitter.get(
        ChatWrittenEvent.name,
      ) as ChatWrittenEvent;
      expect(actual.chats).toMatchInlineSnapshot(`
        [
          Chat {
            "props": {
              "message": Message {
                "authorId": "ownerId",
                "content": "공유딜이 파기되었습니다.
        더이상의 채팅은 불가합니다.",
                "type": "NOTICE",
                "unread": false,
              },
              "orderedKey": "ticketId",
              "shareDealId": "1234",
              "userId": "participantId",
            },
          },
        ]
      `);
    });
  });
});
