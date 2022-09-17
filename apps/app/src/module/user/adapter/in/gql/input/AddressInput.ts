import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';

import { AppendAddressCommand } from '../../../../application/port/in/dto/AppendAddressCommand';
import { AddressType } from '../../../../domain/vo/AddressType';
import { CoordinateInput } from './CoordinateInput';

@InputType()
export class AddressInput {
  @Field({ nullable: true })
  @ValidateIf((o: AddressInput) => o.type === AddressType.ETC)
  @IsNotEmpty()
  alias?: string;

  @Field()
  road: string;

  @Field()
  detail: string;

  @Field(() => AddressType)
  type: AddressType;

  @Field(() => CoordinateInput)
  @Type(() => CoordinateInput)
  @ValidateNested()
  coordinate: CoordinateInput;

  toCommand(userId: string): AppendAddressCommand {
    return new AppendAddressCommand(
      userId,
      this.coordinate.latitude,
      this.coordinate.longitude,
      this.type,
      this.road,
      this.detail,
      this.alias,
    );
  }
}
