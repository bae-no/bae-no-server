import { Field, InputType } from '@nestjs/graphql';

import { UpdateProfileCommand } from '../../../../application/port/in/dto/UpdateProfileCommand';

@InputType()
export class UpdateProfileInput {
  @Field()
  introduce: string;

  toCommand(userId: string) {
    return new UpdateProfileCommand(userId, this.introduce);
  }
}
