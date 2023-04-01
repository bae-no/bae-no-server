import { CoordinateResponse } from '@app/custom/nest/response/CoordinateResponse';
import { Field, ObjectType } from '@nestjs/graphql';

import { AddressSystem } from '../../../../../user/domain/vo/AddressSystem';
import type { ShareZone } from '../../../../domain/vo/ShareZone';

@ObjectType()
export class ShareZoneResponse {
  @Field()
  path: string;

  @Field()
  detail: string;

  @Field(() => AddressSystem)
  system: AddressSystem;

  @Field(() => CoordinateResponse)
  coordinate: CoordinateResponse;

  static of(shareZone: ShareZone): ShareZoneResponse {
    const response = new ShareZoneResponse();

    response.path = shareZone.path;
    response.detail = shareZone.detail;
    response.system = shareZone.system;
    response.coordinate = shareZone.coordinate;

    return response;
  }
}
