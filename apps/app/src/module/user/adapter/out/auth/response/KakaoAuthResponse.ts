import { Expose } from 'class-transformer';

export class KakaoAuthResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;
}
