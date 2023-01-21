import { toResponse } from '@app/custom/fp-ts';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { SampleResponse } from './response/SampleResponse';
import { SampleQueryUseCase } from '../../../application/port/in/SampleQueryUseCase';

@Resolver()
export class SampleQueryResolver {
  constructor(private readonly sampleQueryUseCase: SampleQueryUseCase) {}

  @Query(() => SampleResponse)
  async sample(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<SampleResponse> {
    return pipe(
      this.sampleQueryUseCase.findById(id),
      toResponse(SampleResponse.of),
    )();
  }
}
