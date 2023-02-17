import type { UserId } from '../../../../domain/User';
import { Address } from '../../../../domain/vo/Address';
import type { AddressSystem } from '../../../../domain/vo/AddressSystem';
import type { AddressType } from '../../../../domain/vo/AddressType';

export class AppendAddressCommand {
  constructor(
    readonly userId: UserId,
    readonly latitude: number,
    readonly longitude: number,
    readonly addressType: AddressType,
    readonly addressSystem: AddressSystem,
    readonly addressPath: string,
    readonly addressDetail: string,
    readonly addressAlias?: string,
  ) {}

  toAddress(): Address {
    return new Address(
      this.addressAlias ?? '',
      this.addressSystem,
      this.addressPath,
      this.addressDetail,
      this.addressType,
      this.latitude,
      this.longitude,
    );
  }
}
