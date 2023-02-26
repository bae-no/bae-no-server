import { T, pipe } from '@app/custom/effect';
import type { AuthError } from '@app/domain/error/AuthError';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

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
  signIn(
    @Args('input') input: SignInInput,
  ): T.IO<DBError | AuthError, SignInResponse> {
    return pipe(
      input.toCommand(),
      (command) => this.userCommandUseCase.signIn(command),
      T.map(SignInResponse.of),
    );
  }

  @Mutation(() => Boolean, { description: '초기 닉네임 & 주소 등록' })
  enrollUser(
    @Args('input') input: EnrollUserInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError | NotFoundException, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.enroll(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '회원탈퇴하기' })
  leave(
    @Args('input') input: LeaveUserInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.leave(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '주소 추가' })
  appendAddress(
    @Args('input') input: AddressInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.appendAddress(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '주소 삭제' })
  deleteAddress(
    @Args('key', { type: () => ID }) key: string,
    @CurrentSession() session: Session,
  ): T.IO<DBError, true> {
    return pipe(
      new DeleteAddressCommand(key, session.id),
      (command) => this.userCommandUseCase.deleteAddress(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '프로필 정보 수정' })
  updateProfile(
    @Args('input') input: UpdateProfileInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.userCommandUseCase.updateProfile(command),
      T.map(() => true),
    );
  }
}
