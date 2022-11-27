import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { StubPushMessage } from '../../../../../libs/push-message/test/fixture/StubPushMessageModule';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { ChatWrittenEvent } from '../../../src/module/chat/domain/event/ChatWrittenEvent';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { UserPushTokenListener } from '../../../src/module/user-push-token/adapter/in/listener/UserPushTokenListener';
import { UserPushTokenQueryRepositoryPort } from '../../../src/module/user-push-token/application/port/out/UserPushTokenQueryRepositoryPort';
import { UserPushToken } from '../../../src/module/user-push-token/domain/UserPushToken';

describe('UserPushTokenEventListener', () => {
  const pushMessage = new StubPushMessage();
  const userPushTokenQueryRepositoryPort =
    mock<UserPushTokenQueryRepositoryPort>();
  const shareDealCommandService = new UserPushTokenListener(
    userPushTokenQueryRepositoryPort,
    pushMessage,
  );

  beforeEach(() => {
    pushMessage.clear();
    mockReset(userPushTokenQueryRepositoryPort);
  });

  describe('handleChatWrittenEvent', () => {
    it('본인이 작성한 채팅은 알림을 보내지 않는다', async () => {
      // given
      const chats = new ChatWrittenEvent([
        Chat.of({
          shareDealId: 'shareDealId',
          userId: 'authorId',
          timestamp: 1000,
          message: Message.normal('authorId', 'content', false),
        }),
      ]);

      // when
      await shareDealCommandService.handleChatWrittenEvent(chats);

      // then
      expect(pushMessage.pushToken).toBe('');
      expect(pushMessage.content).toBe('');
    });

    it('채팅 푸시 메시지를 전송한다', async () => {
      // given
      const chats = new ChatWrittenEvent([
        Chat.of({
          shareDealId: 'shareDealId',
          userId: 'userId',
          timestamp: new Date().getTime(),
          message: Message.normal('authorId', 'content', false),
        }),
      ]);

      userPushTokenQueryRepositoryPort.findByUserIds.mockReturnValue(
        right([new UserPushToken({ userId: 'userId', token: 'token' })]),
      );

      // when
      await shareDealCommandService.handleChatWrittenEvent(chats);

      // then
      expect(pushMessage.pushToken).toBe('token');
      expect(pushMessage.content).toBe('content');
    });
  });
});
