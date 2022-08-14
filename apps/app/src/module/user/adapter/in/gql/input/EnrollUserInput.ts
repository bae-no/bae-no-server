import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { EnrollUserCommand } from '../../../../application/port/in/dto/EnrollUserCommand';
import { AddressInput } from './AddressInput';
import { CoordinateInput } from './CoordinateInput';

@InputType()
export class EnrollUserInput {
  @Field()
  nickname: string;

  @Field(() => AddressInput)
  @Type(() => AddressInput)
  @ValidateNested()
  address: AddressInput;

  @Field(() => CoordinateInput)
  @Type(() => CoordinateInput)
  @ValidateNested()
  coordinate: CoordinateInput;

  toCommand(userId: string) {
    return new EnrollUserCommand(
      userId,
      this.nickname,
      this.coordinate.latitude,
      this.coordinate.longitude,
      this.address.type,
      this.address.road,
      this.address.detail,
      this.address.alias,
    );
  }
}
