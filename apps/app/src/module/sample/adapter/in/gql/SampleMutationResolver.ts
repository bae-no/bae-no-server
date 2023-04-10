import { T, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateSampleInput } from './input/CreateSampleInput';
import { SampleResponse } from './response/SampleResponse';
import { CreateSampleCommand } from '../../../application/port/in/dto/CreateSampleCommand';
import { SampleCommandUseCase } from '../../../application/port/in/SampleCommandUseCase';

@Resolver()
export class SampleMutationResolver {
  constructor(
    private readonly sampleCommandUseCase: SampleCommandUseCase,
    private readonly pubSubPort: PubSubPort,
  ) {}

  @Mutation(() => SampleResponse)
  createSample(
    @Args('input') input: CreateSampleInput,
  ): T.IO<DBError, SampleResponse> {
    return pipe(
      new CreateSampleCommand(input.name, input.email),
      (command) => this.sampleCommandUseCase.create(command),
      T.map((sample) => {
        const response = SampleResponse.of(sample);
        this.pubSubPort.publish('sampleAdded', response);

        return sample;
      }),
    );
  }
}
