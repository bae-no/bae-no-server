import { toResponse } from '@app/domain/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { UserCommandUseCase } from '../../../application/port/in/UserCommandUseCase';
import { SignInInput } from './input/SignInInput';
import { SignInResponse } from './response/SignInResponse';

@Resolver()
export class UserMutationResolver {
  constructor(private readonly userCommandUseCase: UserCommandUseCase) {}

  @Mutation(() => SignInResponse, { description: '회원 가입 & 로그인' })
  async signIn(@Args('input') input: SignInInput): Promise<SignInResponse> {
    return pipe(
      input.toCommand(),
      (command) => this.userCommandUseCase.signIn(command),
      toResponse(SignInResponse.of),
    )();
  }
}
