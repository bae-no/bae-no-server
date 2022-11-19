import { PageCommand } from '@app/domain/command/PageCommand';

export class FindChatByUserCommand extends PageCommand {
  constructor(
    readonly shareDealId: string,
    readonly userId: string,
    page?: number,
    size?: number,
  ) {
    super(page, size);
  }
}
