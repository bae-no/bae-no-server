import { Address } from '../../../../domain/vo/Address';
import { AddressType } from '../../../../domain/vo/AddressType';

export class EnrollUserCommand {
  constructor(
    readonly nickname: string,
    readonly latitude: number,
    readonly longitude: number,
    readonly addressType: AddressType,
    readonly addressRoad: string,
    readonly addressDetail: string,
    readonly addressAlias?: string,
  ) {}

  toAddress(): Address {
    return new Address(
      this.addressAlias ?? '',
      this.addressRoad,
      this.addressDetail,
      this.addressType,
      this.latitude,
      this.longitude,
    );
  }
}
