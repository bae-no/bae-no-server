import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignInInput } from './input/SignInInput';
import { SignInResponse } from './response/SignInResponse';

@Resolver()
export class UserMutationResolver {
  private readonly logger = new Logger(UserMutationResolver.name);

  @Mutation(() => SignInResponse, { description: '회원 가입 & 로그인' })
  async signIn(@Args('input') input: SignInInput): Promise<SignInResponse> {
    this.logger.log(input);

    return {} as any;
  }
}
