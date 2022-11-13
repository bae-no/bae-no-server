import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { StubPubSub } from '../../../../../libs/pub-sub/test/fixture/StubPubSubModule';
import { ChatEventListener } from '../../../src/module/chat/adapter/in/listener/ChatEventListener';
import { ChatRepositoryPort } from '../../../src/module/chat/application/port/out/ChatRepositoryPort';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStartedEvent } from '../../../src/module/share-deal/domain/event/ShareDealStartedEvent';
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
      const shareDeal = ShareDealFactory.create({ id: shareDealId });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));
      chatRepositoryPort.create.mockImplementation((value) => right(value));

      const event = new ShareDealStartedEvent(shareDealId);

      // when
      await shareDealCommandService.handleShareDealStartedEvent(event);

      // then
      expect(eventEmitter.get(ChatWrittenEvent.EVENT_NAME)).not.toBeUndefined();
    });
  });
});
