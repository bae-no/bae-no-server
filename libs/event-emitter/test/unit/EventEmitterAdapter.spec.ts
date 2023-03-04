import { DomainEvent } from '@app/domain/event/DomainEvent';
import { EventEmitterAdapter } from '@app/event-emitter/EventEmitterAdapter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { describe, expect, it } from 'vitest';

import { expectNonNullable } from '../../../../apps/app/test/fixture/utils';

describe('EventEmitterAdapter', () => {
  const eventEmitter = new EventEmitter2();
  const eventEmitterAdapter = new EventEmitterAdapter(eventEmitter);

  it('이벤트를 발행한다', () => {
    // given
    class TestEvent extends DomainEvent {
      data = 'data';
    }

    const event = new TestEvent();

    let actual: TestEvent | undefined;
    eventEmitter.addListener(TestEvent.name, (data) => {
      actual = data;
    });

    // when
    eventEmitterAdapter.emit(event);

    // then
    expectNonNullable(actual);
    expect(actual.data).toBe('data');
  });
});
