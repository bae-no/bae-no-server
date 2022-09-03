import { toResponse } from '@app/external/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { UserCommandUseCase } from '../../../application/port/in/UserCommandUseCase';
import { CurrentSession } from './auth/CurrentSession';
import { Public } from './auth/Public';
import { Session } from './auth/Session';
import { EnrollUserInput } from './input/EnrollUserInput';
import { LeaveUserInput } from './input/LeaveUserInput';
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
  async enrollUser(
    @Args('input') input: EnrollUserInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.enroll(command),
      toResponse(constTrue),
    )();
  }

  @Mutation(() => Boolean, { description: '회원탈퇴하기' })
  async leave(
    @Args('input') input: LeaveUserInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.leave(command),
      toResponse(constTrue),
    )();
  }
}
