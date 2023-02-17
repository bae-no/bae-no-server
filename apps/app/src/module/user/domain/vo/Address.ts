import type { AddressSystem } from './AddressSystem';
import type { AddressType } from './AddressType';
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
}
