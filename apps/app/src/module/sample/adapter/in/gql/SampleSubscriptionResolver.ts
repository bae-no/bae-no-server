import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { SampleResponse } from './response/SampleResponse';

const pubSub = new PubSub();

@Resolver()
export class SampleSubscriptionResolver {
  @Subscription(() => SampleResponse)
  async sampleAdded() {
    return pubSub.asyncIterator('sampleAdded');
  }
}
