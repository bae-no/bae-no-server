import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Module } from '@nestjs/common';

export class StubPubSub extends PubSubPort {
  private queue = new Map<string, any>();

  clear() {
    this.queue.clear();
  }

  get(trigger: string): unknown {
    return this.queue.get(trigger);
  }

  override publish(trigger: string, data: unknown) {
    this.queue.set(trigger, data);
  }

  override subscribe<T>(trigger: string): AsyncIterator<T> {
    const queue = this.queue;

    return (async function* () {
      yield queue.get(trigger);
    })();
  }
}

@Module({
  providers: [{ provide: PubSubPort, useClass: StubPubSub }],
  exports: [PubSubPort],
})
export class StubPubSubModule {}
