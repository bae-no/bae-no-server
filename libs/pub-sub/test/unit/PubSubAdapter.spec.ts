import { PubSubAdapter } from '@app/pub-sub/PubSubAdapter';

describe('PubSubAdapter', () => {
  const pubSubAdapter = new PubSubAdapter();

  xit('정상적으로 publish, subscribe 한다', async () => {
    // given
    pubSubAdapter.publish('trigger', { foo: 'bar' });

    // when
    const result = pubSubAdapter.subscribe('trigger');

    // then
    const value = await result.next();
    expect(value).toStrictEqual({ value: { foo: 'bar' } });
  });
});
