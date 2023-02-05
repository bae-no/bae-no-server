import { CursorCommand } from '@app/domain/command/CursorCommand';

import { UserId } from '../../../../../user/domain/User';

export class FindChatByUserCommand extends CursorCommand<string> {
  constructor(
    readonly shareDealId: string,
    readonly userId: UserId,
    cursor?: string,
    size?: number,
  ) {
    super(cursor, size);
  }
}
