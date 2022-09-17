import { O, TE, toResponse } from '@app/external/fp-ts';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

import { UserQueryRepositoryPort } from '../../../application/port/out/UserQueryRepositoryPort';
import { CurrentSession } from './auth/CurrentSession';
import { Session } from './auth/Session';
import { UserAddressResponse } from './response/UserAddressResponse';

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

  @Query(() => [UserAddressResponse], { description: '등록한 주소목록' })
  async addresses(
    @CurrentSession() session: Session,
  ): Promise<UserAddressResponse[]> {
    return pipe(
      this.userQueryRepositoryPort.findById(session.id),
      TE.map((user) => user.addresses),
      toResponse(UserAddressResponse.of),
    )();
  }
}
