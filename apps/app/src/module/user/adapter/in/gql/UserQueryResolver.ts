import { O, toResponse } from '@app/external/fp-ts';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { UserQueryRepositoryPort } from '../../../application/port/out/UserQueryRepositoryPort';

@Resolver()
export class UserQueryResolver {
  constructor(
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
  ) {}

  @Query(() => Boolean, { description: '닉네임 중복여부' })
  async hasNickname(@Args('nickname') nickname: string): Promise<boolean> {
    return pipe(
      this.userQueryRepositoryPort.findByNickname(nickname),
      toResponse(O.isSome),
    )();
  }
}
