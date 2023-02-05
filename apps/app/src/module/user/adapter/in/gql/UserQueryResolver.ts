import { O, TE, toResponse } from '@app/custom/fp-ts';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/function';

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

  @Query(() => MyProfileResponse, { description: '내 프로필 정보' })
  async myProfile(
    @CurrentSession() session: Session,
  ): Promise<MyProfileResponse> {
    return pipe(
      this.userQueryRepositoryPort.findById(session.id),
      toResponse(MyProfileResponse.of),
    )();
  }

  @Query(() => UserProfileResponse, { description: '프로필 정보' })
  async profile(
    @Args('userId', { type: () => ID }) userId: UserId,
  ): Promise<UserProfileResponse> {
    return pipe(
      this.userQueryRepositoryPort.findById(userId),
      toResponse(UserProfileResponse.of),
    )();
  }
}
