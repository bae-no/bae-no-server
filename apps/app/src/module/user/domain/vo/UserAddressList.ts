import type { Address } from './Address';

export class UserAddressList {
  static MAX_ADDRESSES_COUNT = 6;

  private constructor(readonly addresses: Address[]) {}

  get count(): number {
    return this.addresses.length;
  }

  static of(addresses: Address[] = []) {
    if (this.MAX_ADDRESSES_COUNT < addresses.length) {
      throw new Error(
        `주소는 최대 ${this.MAX_ADDRESSES_COUNT}개까지 등록할 수 있습니다.`,
      );
    }

    return new UserAddressList(addresses);
  }

  append(address: Address): UserAddressList {
    return UserAddressList.of([...this.addresses, address]);
  }

  delete(key: string): UserAddressList {
    const keyIndex = Number(key);
    const filtered = this.addresses.filter((_, index) => index !== keyIndex);

    return UserAddressList.of(filtered);
  }

  find(key: number): Address | undefined {
    return this.addresses[key];
  }
}
