import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Logger } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';

export class PubSubAdapter extends PubSubPort {
  private readonly logger = new Logger(PubSubAdapter.name);

  constructor(private readonly pubSub: PubSubEngine) {
    super();
  }

  override publish(trigger: string, data: unknown): void {
    this.pubSub
      .publish(trigger, data)
      .catch((error) =>
        this.logger.error(
          `publish error: trigger=${trigger}, data=${JSON.stringify(data)}`,
          error,
        ),
      );
  }

  override subscribe<T>(trigger: string): AsyncIterator<T, any, undefined> {
    return this.pubSub.asyncIterator(trigger);
  }
}
