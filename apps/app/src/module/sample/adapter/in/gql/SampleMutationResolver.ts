import { toResponse } from '@app/domain/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { CreateSampleCommand } from '../../../application/port/in/CreateSampleCommand';
import { SampleCommandUseCase } from '../../../application/port/in/SampleCommandUseCase';
import { CreateSampleInput } from './input/CreateSampleInput';
import { SampleResponse } from './response/SampleResponse';

@Resolver()
export class SampleMutationResolver {
  constructor(private readonly sampleCommandUseCase: SampleCommandUseCase) {}

  @Mutation(() => SampleResponse)
  create(@Args('input') input: CreateSampleInput): Promise<SampleResponse> {
    return pipe(
      new CreateSampleCommand(input.name, input.email),
      (command) => this.sampleCommandUseCase.create(command),
      toResponse(SampleResponse.of),
    )();
  }
}
