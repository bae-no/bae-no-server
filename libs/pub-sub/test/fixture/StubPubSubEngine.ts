import { PubSubEngine } from 'graphql-subscriptions';

export class StubPubSubEngine extends PubSubEngine {
  #inner = new Map<string, any>();

  clear() {
    this.#inner.clear();
  }

  override async publish(triggerName: string, payload: any): Promise<void> {
    this.#inner.set(triggerName, payload);
  }

  override async subscribe(
    triggerName: string,
    onMessage: (payload: any) => any,
  ): Promise<number> {
    onMessage(this.#inner.get(triggerName));

    return Promise.resolve(0);
  }

  override unsubscribe(subId: number): any {
    return subId;
  }
}
