import { Expose } from 'class-transformer';

export class GoogleProfileResponse {
  @Expose()
  id: number;
}
