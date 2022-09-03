import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { TE, toResponse } from '@app/external/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { identity, pipe } from 'fp-ts/function';

import { CreateSampleCommand } from '../../../application/port/in/dto/CreateSampleCommand';
import { SampleCommandUseCase } from '../../../application/port/in/SampleCommandUseCase';
import { CreateSampleInput } from './input/CreateSampleInput';
import { SampleResponse } from './response/SampleResponse';

@Resolver()
export class SampleMutationResolver {
  constructor(
    private readonly sampleCommandUseCase: SampleCommandUseCase,
    private readonly pubSubPort: PubSubPort,
  ) {}

  @Mutation(() => SampleResponse)
  async createSample(
    @Args('input') input: CreateSampleInput,
  ): Promise<SampleResponse> {
    return pipe(
      new CreateSampleCommand(input.name, input.email),
      (command) => this.sampleCommandUseCase.create(command),
      TE.map((sample) => {
        const response = SampleResponse.of(sample);
        this.pubSubPort.publish('sampleAdded', { sampleAdded: response });

        return sample;
      }),
      toResponse(identity),
    )();
  }
}
