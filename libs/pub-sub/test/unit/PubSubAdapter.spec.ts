import { PubSubAdapter } from '@app/pub-sub/PubSubAdapter';
import { describe, expect, it } from 'vitest';

import { StubPubSubEngine } from '../fixture/StubPubSubEngine';

describe('PubSubAdapter', () => {
  const pubSub = new StubPubSubEngine();
  const pubSubAdapter = new PubSubAdapter(pubSub);

  it('정상적으로 publish, subscribe 한다', async () => {
    // given
    pubSubAdapter.publish('trigger', { foo: 'bar' });

    // when
    const result = pubSubAdapter.subscribe('trigger');

    // then
    const nextResult = await result.next();
    expect(nextResult.value).toStrictEqual({ foo: 'bar' });
  });
});
