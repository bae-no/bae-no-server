export class AuthToken {
  constructor(readonly accessToken: string, readonly expiredAt: Date) {}
}
