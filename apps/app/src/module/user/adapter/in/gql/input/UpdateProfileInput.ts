import { Field, InputType } from '@nestjs/graphql';

import { UpdateProfileCommand } from '../../../../application/port/in/dto/UpdateProfileCommand';
import type { UserId } from '../../../../domain/User';

@InputType()
export class UpdateProfileInput {
  @Field()
  introduce: string;

  toCommand(userId: UserId) {
    return new UpdateProfileCommand(userId, this.introduce);
  }
}
