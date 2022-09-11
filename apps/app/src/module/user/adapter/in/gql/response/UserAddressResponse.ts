import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Address } from '../../../../domain/vo/Address';
import { AddressType } from '../../../../domain/vo/AddressType';
import { CoordinateResponse } from './CoordinateResponse';

@ObjectType()
export class UserAddressResponse {
  @Field(() => ID)
  key: string;

  @Field()
  alias: string;

  @Field()
  road: string;

  @Field()
  detail: string;

  @Field(() => AddressType)
  type: AddressType;

  @Field(() => CoordinateResponse)
  coordinate: CoordinateResponse;

  @Field({ description: '닉네임 및 주소 입력여부' })
  hasProfile: boolean;

  static of(addresses: Address[]): UserAddressResponse[] {
    return addresses.map((address, index) => {
      const response = new UserAddressResponse();

      response.key = `${index}`;
      response.alias = address.alias;
      response.road = address.road;
      response.detail = address.detail;
      response.type = address.type;
      response.coordinate = address.coordinate;

      return response;
    });
  }
}
