import { DBError } from '@app/domain/error/DBError';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PermissionDeniedException } from '@app/domain/exception/PermissionDeniedException';
import { TaskEither } from 'fp-ts/TaskEither';

import { EndShareDealCommand } from './dto/EndShareDealCommand';
import { JoinShareDealCommand } from './dto/JoinShareDealCommand';
import { OpenShareDealCommand } from './dto/OpenShareDealCommand';
import { StartShareDealCommand } from './dto/StartShareDealCommand';
import { UpdateShareDealCommand } from './dto/UpdateShareDealCommand';
import { NotJoinableShareDealException } from './exception/NotJoinableShareDealException';

export type JoinChatError =
  | DBError
  | NotFoundException
  | NotJoinableShareDealException;

export type StartShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export type EndShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export type UpdateShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException
  | PermissionDeniedException;

export abstract class ShareDealCommandUseCase {
  abstract open(command: OpenShareDealCommand): TaskEither<DBError, void>;

  abstract join(command: JoinShareDealCommand): TaskEither<JoinChatError, void>;

  abstract start(
    command: StartShareDealCommand,
  ): TaskEither<StartShareDealError, void>;

  abstract end(
    command: EndShareDealCommand,
  ): TaskEither<EndShareDealError, void>;

  abstract update(
    command: UpdateShareDealCommand,
  ): TaskEither<UpdateShareDealError, void>;
}
