import { DomainEvent } from '@app/domain/event/DomainEvent';
import { EVENT_QUEUE } from '@app/event-emitter/constant';
import { OnDomainEvent } from '@app/event-emitter/decorator/OnDomainEvent';
import { EventDispatcher } from '@app/event-emitter/EventDispatcher';
import { BullModule } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import type { ConnectionOptions } from 'bullmq';
import { Queue } from 'bullmq';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('EventDispatcher', () => {
  const connection: ConnectionOptions = { host: 'localhost', port: 6379 };
  const queue = new Queue(EVENT_QUEUE, { connection });
  let actual: DomainEvent | undefined;

  class TestEvent extends DomainEvent {}

  @Injectable()
  class EventHandler {
    @OnDomainEvent(TestEvent)
    handle(event: TestEvent) {
      actual = event;
    }
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        DiscoveryModule,
        BullModule.forRoot({ connection }),
        BullModule.registerQueue({ name: EVENT_QUEUE }),
      ],
      providers: [EventDispatcher, EventHandler],
    }).compile();

    await module.init();
  });

  afterAll(async () => {
    await queue.close();
  });

  beforeEach(() => {
    actual = undefined;
  });

  it('OnDomainEvent로 설정한 이벤트를 받을 수 있다', async () => {
    // given
    const event = new TestEvent();

    // when
    await queue.add(TestEvent.name, event);

    // then
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    expect(actual).toBeInstanceOf(TestEvent);
  });

  it('OnDomainEvent에 지정한 이벤트는 받지않는다', async () => {
    // when
    await queue.add('OtherEvent', {});

    // then
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    expect(actual).toBeUndefined();
  });
});
