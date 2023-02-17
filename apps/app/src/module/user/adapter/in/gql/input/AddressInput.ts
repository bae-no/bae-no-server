import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';

import { CoordinateInput } from './CoordinateInput';
import { AppendAddressCommand } from '../../../../application/port/in/dto/AppendAddressCommand';
import type { UserId } from '../../../../domain/User';
import { AddressSystem } from '../../../../domain/vo/AddressSystem';
import { AddressType } from '../../../../domain/vo/AddressType';

@InputType()
export class AddressInput {
  @Field({ nullable: true })
  @ValidateIf((o: AddressInput) => o.type === AddressType.ETC)
  @IsNotEmpty()
  alias?: string;

  @Field()
  path: string;

  @Field()
  detail: string;

  @Field(() => AddressType)
  type: AddressType;

  @Field(() => AddressSystem)
  system: AddressSystem;

  @Field(() => CoordinateInput)
  @Type(() => CoordinateInput)
  @ValidateNested()
  coordinate: CoordinateInput;

  toCommand(userId: UserId): AppendAddressCommand {
    return new AppendAddressCommand(
      userId,
      this.coordinate.latitude,
      this.coordinate.longitude,
      this.type,
      this.system,
      this.path,
      this.detail,
      this.alias,
    );
  }
}
