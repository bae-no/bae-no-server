import { Field, ObjectType } from '@nestjs/graphql';

import { AuthType } from '../../../../../../user/domain/AuthType';

@ObjectType()
export class AuthCategory {
  @Field(() => AuthType)
  code: AuthType;

  @Field()
  name: string;

  constructor(code: AuthType, name: string) {
    this.code = code;
    this.name = name;
  }

  static readonly VALUES = Object.keys(AuthType).map((key) => {
    switch (key) {
      case AuthType.GOOGLE:
        return new AuthCategory(AuthType.GOOGLE, '구글');
      case AuthType.KAKAO:
        return new AuthCategory(AuthType.KAKAO, '카카오');
      case AuthType.APPLE:
        return new AuthCategory(AuthType.APPLE, '애플');
      default:
        throw new Error('unknown auth type');
    }
  });
}
