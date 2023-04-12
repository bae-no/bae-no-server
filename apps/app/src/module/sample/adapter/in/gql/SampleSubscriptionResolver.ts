import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Resolver, Subscription } from '@nestjs/graphql';

import { SampleResponse } from './response/SampleResponse';

@Resolver()
export class SampleSubscriptionResolver {
  constructor(private readonly pubSubPort: PubSubPort) {}

  @Subscription(() => SampleResponse, { resolve: (payload) => payload })
  async sampleAdded(): Promise<AsyncIterator<SampleResponse>> {
    return this.pubSubPort.subscribe<SampleResponse>('sampleAdded');
  }
}
