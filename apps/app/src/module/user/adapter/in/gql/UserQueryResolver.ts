import { T, O, pipe } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';

import { CurrentSession } from './auth/CurrentSession';
import { Session } from './auth/Session';
import { MyProfileResponse } from './response/MyProfileResponse';
import { UserAddressResponse } from './response/UserAddressResponse';
import { UserProfileResponse } from './response/UserProfileResponse';
import { UserQueryRepositoryPort } from '../../../application/port/out/UserQueryRepositoryPort';
import { UserId } from '../../../domain/User';

@Resolver()
export class UserQueryResolver {
  constructor(
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
  ) {}

  @Query(() => Boolean, { description: '닉네임 중복여부' })
  hasNickname(@Args('nickname') nickname: string): T.IO<DBError, boolean> {
    return pipe(
      this.userQueryRepositoryPort.findByNickname(nickname),
      T.map(O.isSome),
    );
  }

  @Query(() => [UserAddressResponse], { description: '등록한 주소목록' })
  addresses(
    @CurrentSession() session: Session,
  ): T.IO<DBError | NotFoundException, UserAddressResponse[]> {
    return pipe(
      this.userQueryRepositoryPort.findById(session.id),
      T.map((user) => user.addresses),
      T.map(UserAddressResponse.of),
    );
  }

  @Query(() => MyProfileResponse, { description: '내 프로필 정보' })
  myProfile(
    @CurrentSession() session: Session,
  ): T.IO<DBError | NotFoundException, MyProfileResponse> {
    return pipe(
      this.userQueryRepositoryPort.findById(session.id),
      T.map(MyProfileResponse.of),
    );
  }

  @Query(() => UserProfileResponse, { description: '프로필 정보' })
  profile(
    @Args('userId', { type: () => ID }) userId: UserId,
  ): T.IO<DBError | NotFoundException, UserProfileResponse> {
    return pipe(
      this.userQueryRepositoryPort.findById(userId),
      T.map(UserProfileResponse.of),
    );
  }
}
