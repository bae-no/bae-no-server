import { toResponse } from '@app/custom/fp-ts';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { CurrentSession } from './auth/CurrentSession';
import { Public } from './auth/Public';
import { Session } from './auth/Session';
import { AddressInput } from './input/AddressInput';
import { EnrollUserInput } from './input/EnrollUserInput';
import { LeaveUserInput } from './input/LeaveUserInput';
import { SignInInput } from './input/SignInInput';
import { UpdateProfileInput } from './input/UpdateProfileInput';
import { SignInResponse } from './response/SignInResponse';
import { DeleteAddressCommand } from '../../../application/port/in/dto/DeleteAddressCommand';
import { UserCommandUseCase } from '../../../application/port/in/UserCommandUseCase';

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

  @Mutation(() => Boolean, { description: '주소 추가' })
  async appendAddress(
    @Args('input') input: AddressInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.appendAddress(command),
      toResponse(constTrue),
    )();
  }

  @Mutation(() => Boolean, { description: '주소 삭제' })
  async deleteAddress(
    @Args('key', { type: () => ID }) key: string,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      new DeleteAddressCommand(key, session.id),
      (command) => this.userCommandUseCase.deleteAddress(command),
      toResponse(constTrue),
    )();
  }

  @Mutation(() => Boolean, { description: '프로필 정보 수정' })
  async updateProfile(
    @Args('input') input: UpdateProfileInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.updateProfile(command),
      toResponse(constTrue),
    )();
  }
}
