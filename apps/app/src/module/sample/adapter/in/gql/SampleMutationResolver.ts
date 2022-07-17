import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateSampleCommand } from '../../../application/port/in/CreateSampleCommand';
import { SampleCommandUseCase } from '../../../application/port/in/SampleCommandUseCase';
import { CreateSampleInput } from './input/CreateSampleInput';
import { SampleResponse } from './response/SampleResponse';

@Resolver()
export class SampleMutationResolver {
  constructor(private readonly sampleCommandUseCase: SampleCommandUseCase) {}

  @Mutation(() => SampleResponse)
  create(@Args('input') input: CreateSampleInput): Promise<SampleResponse> {
    const command = new CreateSampleCommand(input.name, input.email);

    return this.sampleCommandUseCase.create(command).then(SampleResponse.of);
  }
}
