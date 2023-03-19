import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';

import type { EndShareDealCommand } from './dto/EndShareDealCommand';
import type { JoinShareDealCommand } from './dto/JoinShareDealCommand';
import type { LeaveShareDealCommand } from './dto/LeaveShareDealCommand';
import type { OpenShareDealCommand } from './dto/OpenShareDealCommand';
import type { StartShareDealCommand } from './dto/StartShareDealCommand';
import type { UpdateShareDealCommand } from './dto/UpdateShareDealCommand';
import type { NotJoinableShareDealException } from './exception/NotJoinableShareDealException';
import type { ShareDealId } from '../../../domain/ShareDeal';

export type JoinShareDealError =
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
  | IllegalStateException;

export type LeaveShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export abstract class ShareDealCommandUseCase {
  abstract open(command: OpenShareDealCommand): T.IO<DBError, ShareDealId>;

  abstract join(command: JoinShareDealCommand): T.IO<JoinShareDealError, void>;

  abstract start(
    command: StartShareDealCommand,
  ): T.IO<StartShareDealError, void>;

  abstract end(command: EndShareDealCommand): T.IO<EndShareDealError, void>;

  abstract update(
    command: UpdateShareDealCommand,
  ): T.IO<UpdateShareDealError, void>;

  abstract leave(
    command: LeaveShareDealCommand,
  ): T.IO<LeaveShareDealError, void>;
}
