import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { JoinChatCommand } from './dto/JoinChatCommand';
import { OpenShareDealCommand } from './dto/OpenShareDealCommand';
import { NotOpenShareDealException } from './exception/NotOpenShareDealException';

export type JoinChatError =
  | DBError
  | NotFoundException
  | NotOpenShareDealException;

export abstract class ShareDealCommandUseCase {
  abstract open(command: OpenShareDealCommand): TaskEither<DBError, void>;

  abstract join(command: JoinChatCommand): TaskEither<JoinChatError, void>;
}
