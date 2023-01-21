import { toResponse } from '@app/custom/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { CurrentSession } from './auth/CurrentSession';
import { Session } from './auth/Session';
import { SendPhoneVerificationCodeInput } from './input/SendPhoneVerificationCodeInput';
import { VerifyPhoneVerificationCodeInput } from './input/VerifyPhoneVerificationCodeInput';
import { PhoneVerificationUseCase } from '../../../application/port/in/PhoneVerificationUseCase';

@Resolver()
export class PhoneVerificationMutationResolver {
  constructor(
    private readonly phoneVerificationUseCase: PhoneVerificationUseCase,
  ) {}

  @Mutation(() => Boolean, { description: '전화번호 인증번호 발송하기' })
  async sendPhoneVerificationCode(
    @Args('input') input: SendPhoneVerificationCodeInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.phoneVerificationUseCase.sendCode(command),
      toResponse(constTrue),
    )();
  }

  @Mutation(() => Boolean, { description: '전화번호 인증번호 검증하기' })
  async verifyPhoneVerificationCode(
    @Args('input') input: VerifyPhoneVerificationCodeInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.phoneVerificationUseCase.verify(command),
      toResponse(constTrue),
    )();
  }
}
