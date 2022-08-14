import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, ValidateIf } from 'class-validator';

import { AddressType } from '../../../../domain/vo/AddressType';

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
}
