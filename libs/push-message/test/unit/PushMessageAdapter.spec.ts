import { PushMessageAdapter } from '@app/push-message/PushMessageAdapter';
import type { Messaging } from 'firebase-admin/lib/messaging';
import { mock } from 'jest-mock-extended';

import {
  assertResolvesFail,
  assertResolvesSuccess,
} from '../../../../apps/app/test/fixture/utils';

describe('PushMessageAdapter', () => {
  const messaging = mock<Messaging>();
  const pushMessageAdapter = new PushMessageAdapter(messaging);

  it('푸시 메시지 전송에 성공한다', async () => {
    // given
    const pushToken = 'pushToken';
    const content = 'content';

    messaging.send.mockResolvedValue('messageId');

    // when
    const result = pushMessageAdapter.send(pushToken, content);

    // then
    await assertResolvesSuccess(result);
  });

  it('푸시 메시지 전송에 실패하면 에러를 반환한다', async () => {
    // given
    const pushToken = 'pushToken';
    const content = 'content';

    messaging.send.mockRejectedValue('error');

    // when
    const result = pushMessageAdapter.send(pushToken, content);

    // then
    await assertResolvesFail(result, (err) => {
      expect(err.message).toBe('error');
    });
  });
});
