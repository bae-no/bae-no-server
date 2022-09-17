export class UpdateProfileCommand {
  constructor(
    readonly userId: string,
    readonly nickname: string,
    readonly phoneNumber: string,
    readonly imageUri: string,
    readonly introduce: string,
  ) {}
}
