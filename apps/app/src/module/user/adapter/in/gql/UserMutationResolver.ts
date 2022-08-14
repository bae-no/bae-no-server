import { toResponse } from '@app/external/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { UserCommandUseCase } from '../../../application/port/in/UserCommandUseCase';
import { Public } from './auth/Public';
import { EnrollUserInput } from './input/EnrollUserInput';
import { SignInInput } from './input/SignInInput';
import { SignInResponse } from './response/SignInResponse';

@Resolver()
export class UserMutationResolver {
  constructor(private readonly userCommandUseCase: UserCommandUseCase) {}

  @Public()
  @Mutation(() => SignInResponse, { description: '회원 가입 & 로그인' })
  async signIn(@Args('input') input: SignInInput): Promise<SignInResponse> {
    return pipe(
      input.toCommand(),
      (command) => this.userCommandUseCase.signIn(command),
      toResponse(SignInResponse.of),
    )();
  }

  @Mutation(() => Boolean, { description: '초기 닉네임 & 주소 등록' })
  async enrollUser(@Args('input') input: EnrollUserInput): Promise<boolean> {
    return pipe(
      input.toCommand(),
      (command) => this.userCommandUseCase.enroll(command),
      toResponse(constTrue),
    )();
  }
}
