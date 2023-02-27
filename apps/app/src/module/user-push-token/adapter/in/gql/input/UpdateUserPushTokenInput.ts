import { Field, InputType } from '@nestjs/graphql';

import type { UserId } from '../../../../../user/domain/User';
import { UpdateUserPushTokenCommand } from '../../../../application/port/in/dto/UpdateUserPushTokenCommand';

@InputType()
export class UpdateUserPushTokenInput {
  @Field()
  token: string;

  toCommand(userId: UserId): UpdateUserPushTokenCommand {
    return new UpdateUserPushTokenCommand(userId, this.token);
  }
}
