import { T, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';

import { SampleResponse } from './response/SampleResponse';
import { Public } from '../../../../user/adapter/in/gql/auth/Public';
import { SampleQueryUseCase } from '../../../application/port/in/SampleQueryUseCase';
import { SampleId } from '../../../domain/Sample';

@Resolver()
export class SampleQueryResolver {
  constructor(private readonly sampleQueryUseCase: SampleQueryUseCase) {}

  @Query(() => SampleResponse)
  @Public()
  sample(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): T.IO<DBError | NotFoundException, SampleResponse> {
    return pipe(
      this.sampleQueryUseCase.findById(SampleId(id)),
      T.map(SampleResponse.of),
    );
  }
}
