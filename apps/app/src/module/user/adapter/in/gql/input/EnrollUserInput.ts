import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AddressInput } from './AddressInput';
import { EnrollUserCommand } from '../../../../application/port/in/dto/EnrollUserCommand';

@InputType()
export class EnrollUserInput {
  @Field()
  nickname: string;

  @Field(() => AddressInput)
  @Type(() => AddressInput)
  @ValidateNested()
  address: AddressInput;

  toCommand(userId: string) {
    return new EnrollUserCommand(
      userId,
      this.nickname,
      this.address.coordinate.latitude,
      this.address.coordinate.longitude,
      this.address.type,
      this.address.system,
      this.address.path,
      this.address.detail,
      this.address.alias,
    );
  }
}
