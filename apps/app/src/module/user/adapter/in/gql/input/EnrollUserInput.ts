import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, ValidateIf } from 'class-validator';

import { EnrollUserCommand } from '../../../../application/port/in/dto/EnrollUserCommand';
import { AddressType } from '../../../../domain/vo/AddressType';

@InputType()
export class EnrollUserInput {
  @Field()
  nickname: string;

  @Field({ nullable: true })
  @ValidateIf((o: EnrollUserInput) => o.addressType === AddressType.ETC)
  @IsNotEmpty()
  addressAlias?: string;

  @Field()
  detailAddress: string;

  @Field(() => AddressType)
  addressType: AddressType;

  toCommand() {
    return new EnrollUserCommand(
      this.nickname,
      this.addressType,
      this.detailAddress,
      this.addressAlias,
    );
  }
}
