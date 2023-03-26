import type { AddressSystem } from './AddressSystem';
import { AddressType } from './AddressType';
import { Coordinate } from './Coordinate';

export class Address {
  readonly coordinate: Coordinate;

  constructor(
    readonly alias: string,
    readonly system: AddressSystem,
    readonly path: string,
    readonly detail: string,
    readonly type: AddressType,
    latitude: number,
    longitude: number,
  ) {
    this.coordinate = Coordinate.of(latitude, longitude);
  }

  get isHomeAndWork(): boolean {
    return this.type === AddressType.HOME || this.type === AddressType.WORK;
  }
}
