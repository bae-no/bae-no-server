import { EventEmitterAdapter } from '@app/event-emitter/EventEmitterAdapter';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('EventEmitterAdapter', () => {
  const eventEmitter = new EventEmitter2();
  const eventEmitterAdapter = new EventEmitterAdapter(eventEmitter);

  it('동기 이벤트를 발행한다', () => {
    // given
    const event = 'event';

    let actual = '';
    eventEmitter.addListener(event, (data) => {
      actual = data;
    });

    // when
    eventEmitterAdapter.emit(event, 'data');

    // then
    expect(actual).toBe('data');
  });

  it('비동기 이벤트를 발행한다', () => {
    // given
    const event = 'event';

    let actual = '';
    eventEmitter.addListener(event, (data) => {
      actual = data;
    });

    // when
    eventEmitterAdapter.emit(event, 'data');

    // then
    expect(actual).toBe('data');
  });
});
