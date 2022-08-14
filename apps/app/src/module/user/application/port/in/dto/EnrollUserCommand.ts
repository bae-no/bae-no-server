import { AddressType } from '../../../../domain/vo/AddressType';

export class EnrollUserCommand {
  constructor(
    readonly nickname: string,
    readonly addressType: AddressType,
    readonly detailAddress: string,
    readonly addressAlias?: string,
  ) {}
}
