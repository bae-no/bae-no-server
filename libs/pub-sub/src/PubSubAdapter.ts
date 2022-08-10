import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubAdapter extends PubSubPort {
  private readonly pubSub = new PubSub();
  private readonly logger = new Logger(PubSubAdapter.name);

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
