export class LeaveUserCommand {
  constructor(
    readonly userId: string,
    readonly name: string,
    readonly reason: string,
  ) {}
}
