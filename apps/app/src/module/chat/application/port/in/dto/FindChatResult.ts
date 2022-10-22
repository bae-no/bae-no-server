export class FindChatResult {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly thumbnail: string,
    readonly lastContent: string,
    readonly unreadCount: number,
  ) {}
}
