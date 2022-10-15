export class WriteChatCommand {
  constructor(
    readonly userId: string,
    readonly shareDealId: string,
    readonly content: string,
  ) {}
}
