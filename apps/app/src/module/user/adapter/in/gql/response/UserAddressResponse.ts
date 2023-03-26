import { CoordinateResponse } from '@app/custom/nest/response/CoordinateResponse';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AddressSystem } from '../../../../domain/vo/AddressSystem';
import { AddressType } from '../../../../domain/vo/AddressType';
import type { UserAddressList } from '../../../../domain/vo/UserAddressList';

@ObjectType()
export class UserAddressResponse {
  @Field(() => ID)
  key: string;

  @Field()
  alias: string;

  @Field()
  path: string;

  @Field()
  detail: string;

  @Field(() => AddressType)
  type: AddressType;

  @Field(() => AddressSystem)
  system: AddressSystem;

  @Field(() => CoordinateResponse)
  coordinate: CoordinateResponse;

  static of(addresses: UserAddressList): UserAddressResponse[] {
    return addresses.map((address, index) => {
      const response = new UserAddressResponse();

      response.key = `${index}`;
      response.alias = address.alias;
      response.system = address.system;
      response.path = address.path;
      response.detail = address.detail;
      response.type = address.type;
      response.coordinate = address.coordinate;

      return response;
    });
  }
}
