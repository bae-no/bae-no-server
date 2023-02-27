import { T, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UpdateUserPushTokenInput } from './input/UpdateUserPushTokenInput';
import { CurrentSession } from '../../../../user/adapter/in/gql/auth/CurrentSession';
import { Session } from '../../../../user/adapter/in/gql/auth/Session';
import { UserPushTokenCommandUseCase } from '../../../application/port/in/UserPushTokenCommandUseCase';

@Resolver()
export class UserPushTokenMutationResolver {
  constructor(
    private readonly userPushTokenCommandUseCase: UserPushTokenCommandUseCase,
  ) {}

  @Mutation(() => Boolean)
  updateUserPushToken(
    @CurrentSession() session: Session,
    @Args('input') input: UpdateUserPushTokenInput,
  ): T.IO<DBError, true> {
    return pipe(
      this.userPushTokenCommandUseCase.update(input.toCommand(session.id)),
      T.map(() => true),
    );
  }
}
