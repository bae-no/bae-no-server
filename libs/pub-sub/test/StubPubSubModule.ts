import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Module } from '@nestjs/common';

class StubPubSub extends PubSubPort {
  private queue = new Map<string, any>();

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
