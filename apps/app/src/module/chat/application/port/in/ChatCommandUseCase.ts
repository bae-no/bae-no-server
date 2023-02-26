import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';

import type { WriteChatCommand } from './dto/WriteChatCommand';
import type { ShareDealAccessDeniedException } from '../../../../share-deal/application/port/in/exception/ShareDealAccessDeniedException';

export type WriteChatError =
  | DBError
  | NotFoundException
  | ShareDealAccessDeniedException;

export abstract class ChatCommandUseCase {
  abstract write(command: WriteChatCommand): T.IO<WriteChatError, void>;
}
