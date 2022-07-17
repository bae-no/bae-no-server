import { Args, Query, Resolver } from '@nestjs/graphql';

import { SampleQueryRepositoryPort } from '../../../application/port/out/SampleQueryRepositoryPort';
import { Sample } from '../../../domain/Sample';

@Resolver()
export class SampleResolver {
  constructor(private readonly sample: SampleQueryRepositoryPort) {}

  @Query(() => Sample)
  findById(@Args() id: string): Promise<Sample | null> {
    return this.sample.findById(id);
  }
}
