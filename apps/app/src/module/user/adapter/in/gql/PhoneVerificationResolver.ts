import { toResponse } from '@app/external/fp-ts';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { constTrue, pipe } from 'fp-ts/function';

import { PhoneVerificationUseCase } from '../../../application/port/in/PhoneVerificationUseCase';
import { CurrentSession } from './auth/CurrentSession';
import { Public } from './auth/Public';
import { Session } from './auth/Session';
import { SendPhoneVerificationCodeInput } from './input/SendPhoneVerificationCodeInput';

@Resolver()
export class PhoneVerificationResolver {
  constructor(
    private readonly phoneVerificationUseCase: PhoneVerificationUseCase,
  ) {}

  @Public()
  @Mutation(() => Boolean, { description: '전화번호 인증번호 발송하기' })
  async sendCode(
    @Args('input') input: SendPhoneVerificationCodeInput,
    @CurrentSession() session: Session,
  ): Promise<boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.phoneVerificationUseCase.sendCode(command),
      toResponse(constTrue),
    )();
  }
}
