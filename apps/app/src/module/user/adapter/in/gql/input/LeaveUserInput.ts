import { Field, InputType } from '@nestjs/graphql';

import { LeaveUserCommand } from '../../../../application/port/in/dto/LeaveUserCommand';

@InputType()
export class LeaveUserInput {
  @Field()
  name: string;

  @Field()
  reason: string;

  toCommand(userId: string): LeaveUserCommand {
    return new LeaveUserCommand(userId, this.name, this.reason);
  }
}
