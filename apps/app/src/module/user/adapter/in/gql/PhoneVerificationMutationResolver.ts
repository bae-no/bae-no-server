import { T, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotificationError } from '@app/domain/error/NotificationError';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentSession } from './auth/CurrentSession';
import { Session } from './auth/Session';
import { SendPhoneVerificationCodeInput } from './input/SendPhoneVerificationCodeInput';
import { VerifyPhoneVerificationCodeInput } from './input/VerifyPhoneVerificationCodeInput';
import type { VerifyPhoneVerificationCodeError } from '../../../application/port/in/PhoneVerificationUseCase';
import { PhoneVerificationUseCase } from '../../../application/port/in/PhoneVerificationUseCase';

@Resolver()
export class PhoneVerificationMutationResolver {
  constructor(
    private readonly phoneVerificationUseCase: PhoneVerificationUseCase,
  ) {}

  @Mutation(() => Boolean, { description: '전화번호 인증번호 발송하기' })
  sendPhoneVerificationCode(
    @Args('input') input: SendPhoneVerificationCodeInput,
    @CurrentSession() session: Session,
  ): T.IO<DBError | NotificationError, true> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.phoneVerificationUseCase.sendCode(command),
      T.map(() => true),
    );
  }

  @Mutation(() => Boolean, { description: '전화번호 인증번호 검증하기' })
  verifyPhoneVerificationCode(
    @Args('input') input: VerifyPhoneVerificationCodeInput,
    @CurrentSession() session: Session,
  ): T.IO<VerifyPhoneVerificationCodeError, boolean> {
    return pipe(
      input.toCommand(session.id),
      (command) => this.phoneVerificationUseCase.verify(command),
      T.map(() => true),
    );
  }
}
