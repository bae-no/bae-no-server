import { DomainEvent } from '@app/domain/event/DomainEvent';
import { EventEmitterAdapter } from '@app/event-emitter/EventEmitterAdapter';
import type { ConnectionOptions } from 'bullmq';
import { Queue, Worker } from 'bullmq';
import { afterAll, describe, expect, it } from 'vitest';

describe('EventEmitterAdapter', () => {
  const queueName = 'event-emitter-test';
  const connection: ConnectionOptions = { host: 'localhost', port: 6379 };
  const queue = new Queue(queueName, { connection });
  const eventEmitterAdapter = new EventEmitterAdapter(queue);

  afterAll(async () => {
    await queue.close();
  });

  it('이벤트를 발행한다', async () => {
    // given
    class TestEvent extends DomainEvent {
      data = 'data';
    }

    const event = new TestEvent();
    const listen = new Promise<TestEvent>((resolve) => {
      const worker = new Worker(
        queueName,
        async (job) => {
          resolve(job.data);
          await worker.close();
        },
        { connection },
      );
    });

    // when
    eventEmitterAdapter.emit(event);

    // then
    const actual = await listen;
    expect(actual.data).toBe('data');
  });
});
