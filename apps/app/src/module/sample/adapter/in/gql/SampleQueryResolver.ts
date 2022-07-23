import { TE } from '@app/domain/fp-ts';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { SampleQueryUseCase } from '../../../application/port/in/SampleQueryUseCase';
import { SampleResponse } from './response/SampleResponse';

@Resolver()
export class SampleQueryResolver {
  constructor(private readonly sampleQueryUseCase: SampleQueryUseCase) {}

  @Query(() => SampleResponse)
  findById(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<SampleResponse> {
    return pipe(
      this.sampleQueryUseCase.findById(id),
      TE.map(SampleResponse.of),
      TE.getOrElse((err) => {
        throw err;
      }),
    )();
  }
}
