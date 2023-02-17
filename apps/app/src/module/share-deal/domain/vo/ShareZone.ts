import type { AddressSystem } from '../../../user/domain/vo/AddressSystem';
import { Coordinate } from '../../../user/domain/vo/Coordinate';

export class ShareZone {
  readonly coordinate: Coordinate;

  constructor(
    readonly system: AddressSystem,
    readonly path: string,
    readonly detail: string,
    latitude: number,
    longitude: number,
  ) {
    this.coordinate = Coordinate.of(latitude, longitude);
  }
}
