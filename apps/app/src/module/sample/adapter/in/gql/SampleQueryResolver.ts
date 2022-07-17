import { Args, ID, Query, Resolver } from '@nestjs/graphql';

import { SampleQueryUseCase } from '../../../application/port/in/SampleQueryUseCase';
import { SampleResponse } from './response/SampleResponse';

@Resolver()
export class SampleQueryResolver {
  constructor(private readonly sampleQueryUseCase: SampleQueryUseCase) {}

  @Query(() => SampleResponse)
  findById(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<SampleResponse> {
    return this.sampleQueryUseCase.findById(id).then(SampleResponse.of);
  }
}
