import { T, pipe, constVoid } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';

import type { ShareDealId } from '../../domain/ShareDeal';
import type { JoinShareDealCommand } from '../port/in/dto/JoinShareDealCommand';
import type { LeaveShareDealCommand } from '../port/in/dto/LeaveShareDealCommand';
import type { OpenShareDealCommand } from '../port/in/dto/OpenShareDealCommand';
import type { StartShareDealCommand } from '../port/in/dto/StartShareDealCommand';
import type { UpdateShareDealCommand } from '../port/in/dto/UpdateShareDealCommand';
import type {
  JoinShareDealError,
  LeaveShareDealError,
  StartShareDealError,
  UpdateShareDealError,
} from '../port/in/ShareDealCommandUseCase';
import { ShareDealCommandUseCase } from '../port/in/ShareDealCommandUseCase';
import { ShareDealQueryRepositoryPort } from '../port/out/ShareDealQueryRepositoryPort';
import { ShareDealRepositoryPort } from '../port/out/ShareDealRepositoryPort';

@Service()
export class ShareDealCommandService extends ShareDealCommandUseCase {
  constructor(
    private readonly shareDealRepositoryPort: ShareDealRepositoryPort,
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
  ) {
    super();
  }

  override open(command: OpenShareDealCommand): T.IO<DBError, ShareDealId> {
    return pipe(
      this.shareDealRepositoryPort.save(command.toDomain()),
      T.map((deal) => deal.id),
    );
  }

  override join(command: JoinShareDealCommand): T.IO<JoinShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      T.chain((deal) => T.fromEither(() => deal.join(command.userId))),
      T.chain((deal) => this.shareDealRepositoryPort.save(deal)),
      T.map(constVoid),
    );
  }

  override start(
    command: StartShareDealCommand,
  ): T.IO<StartShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      T.chain((deal) => T.fromEither(() => deal.start(command.userId))),
      T.chain((deal) => this.shareDealRepositoryPort.save(deal)),
      T.map(constVoid),
    );
  }

  override end(
    command: StartShareDealCommand,
  ): T.IO<StartShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      T.chain((deal) => T.fromEither(() => deal.end(command.userId))),
      T.chain((deal) => this.shareDealRepositoryPort.save(deal)),
      T.map(constVoid),
    );
  }

  override update(
    command: UpdateShareDealCommand,
  ): T.IO<UpdateShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      T.chain((deal) =>
        T.fromEither(() =>
          deal.update(command.userId, command.toShareDealProps()),
        ),
      ),
      T.chain((deal) => this.shareDealRepositoryPort.save(deal)),
      T.map(constVoid),
    );
  }

  leave(command: LeaveShareDealCommand): T.IO<LeaveShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      T.chain((deal) => T.fromEither(() => deal.leave(command.userId))),
      T.chain((deal) => this.shareDealRepositoryPort.save(deal)),
      T.map(constVoid),
    );
  }
}
