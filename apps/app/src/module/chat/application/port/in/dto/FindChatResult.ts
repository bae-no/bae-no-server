export class FindChatResult {
  constructor(
    readonly title: string,
    readonly thumbnail: string,
    readonly lastContent: string,
    readonly unreadCount: number,
  ) {}
}
