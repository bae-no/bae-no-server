import { IllegalArgumentException } from '@app/domain/exception/IllegalArgumentException';

export class Coordinate {
  private constructor(
    readonly latitude: number,
    readonly longitude: number,
  ) {}

  static of(latitude: number, longitude: number): Coordinate {
    if (latitude < 0 || longitude < 0) {
      throw new IllegalArgumentException(
        `Coordinate must be positive: latitude: ${latitude}, longitude: ${longitude}`,
      );
    }

    return new Coordinate(latitude, longitude);
  }
}
