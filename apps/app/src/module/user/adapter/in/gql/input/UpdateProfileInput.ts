import { Field, InputType } from '@nestjs/graphql';

import { UpdateProfileCommand } from '../../../../application/port/in/dto/UpdateProfileCommand';

@InputType()
export class UpdateProfileInput {
  @Field()
  nickname: string;

  @Field()
  phoneNumber: string;

  @Field()
  imageUri: string;

  @Field()
  introduce: string;

  toCommand(userId: string) {
    return new UpdateProfileCommand(
      userId,
      this.nickname,
      this.phoneNumber,
      this.imageUri,
      this.introduce,
    );
  }
}
