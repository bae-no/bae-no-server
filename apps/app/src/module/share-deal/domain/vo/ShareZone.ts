import { Coordinate } from '../../../user/domain/vo/Coordinate';

export class ShareZone {
  readonly coordinate: Coordinate;

  constructor(
    readonly road: string,
    readonly detail: string,
    latitude: number,
    longitude: number,
  ) {
    this.coordinate = Coordinate.of(latitude, longitude);
  }
}
