import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, ValidateIf } from 'class-validator';

import { LeaveReasonType } from './LeaveReasonType';
import { LeaveUserCommand } from '../../../../application/port/in/dto/LeaveUserCommand';
import { UserId } from '../../../../domain/User';

@InputType()
export class LeaveUserInput {
  @Field()
  name: string;

  @Field(() => LeaveReasonType)
  type: LeaveReasonType;

  @Field({ nullable: true })
  @ValidateIf((input) => input.type === LeaveReasonType.ETC)
  @IsNotEmpty()
  body?: string;

  toCommand(userId: UserId): LeaveUserCommand {
    return new LeaveUserCommand(userId, this.name, this.toBody());
  }

  private toBody(): string {
    switch (this.type) {
      case LeaveReasonType.USER_COUNT:
        return '정보 공유하는 사람이 적기 때문에';
      case LeaveReasonType.PLACE:
        return '인원 모이는 장소가 비효율적이기 때문에';
      case LeaveReasonType.PRICE:
        return '생각보다 가격이 비효율적이기 때문에';
      case LeaveReasonType.ETC:
        return this.body || '';
    }
  }
}
