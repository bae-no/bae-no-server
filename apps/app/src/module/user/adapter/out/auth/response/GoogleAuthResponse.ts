import { Expose } from 'class-transformer';

export class GoogleAuthResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;
}
