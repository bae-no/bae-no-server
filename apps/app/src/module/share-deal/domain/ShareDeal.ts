import { AggregateRoot } from '@app/domain/entity/AggregateRoot';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { Either, left, right } from 'fp-ts/Either';

import { ShareDealEndedEvent } from './event/ShareDealEndedEvent';
import { ShareDealStartedEvent } from './event/ShareDealStartedEvent';
import { FoodCategory } from './vo/FoodCategory';
import { ParticipantInfo } from './vo/ParticipantInfo';
import { ShareDealStatus } from './vo/ShareDealStatus';
import { ShareZone } from './vo/ShareZone';

export interface ShareDealProps {
  title: string;
  status: ShareDealStatus;
  category: FoodCategory;
  orderPrice: number;
  ownerId: string;
  participantInfo: ParticipantInfo;
  storeName: string;
  thumbnail: string;
  zone: ShareZone;
}

export type CreateShareDealProps = Omit<
  ShareDealProps,
  'status' | 'participantInfo'
> & {
  minParticipants: number;
};

export class ShareDeal extends AggregateRoot<ShareDealProps> {
  constructor(props: ShareDealProps) {
    super(props);
  }

  get title(): string {
    return this.props.title;
  }

  get category(): FoodCategory {
    return this.props.category;
  }

  get orderPrice(): number {
    return this.props.orderPrice;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get storeName(): string {
    return this.props.storeName;
  }

  get zone(): ShareZone {
    return this.props.zone;
  }

  get status(): ShareDealStatus {
    return this.props.status;
  }

  get thumbnail(): string {
    return this.props.thumbnail;
  }

  get participantInfo(): ParticipantInfo {
    return this.props.participantInfo;
  }

  get isJoinable() {
    return this.status === ShareDealStatus.OPEN;
  }

  static open(props: CreateShareDealProps): ShareDeal {
    const { ownerId, minParticipants, ...otherProps } = props;

    return new ShareDeal({
      ...otherProps,
      ownerId,
      participantInfo: ParticipantInfo.of([ownerId], minParticipants),
      status: ShareDealStatus.OPEN,
    });
  }

  canStart(userId: string): boolean {
    return (
      this.status === ShareDealStatus.OPEN &&
      userId === this.ownerId &&
      this.participantInfo.canStart
    );
  }

  canEnd(userId: string): boolean {
    return this.status === ShareDealStatus.START && userId === this.ownerId;
  }

  canWriteChat(userId: string): boolean {
    if (this.status !== ShareDealStatus.START) {
      return false;
    }

    return this.participantInfo.hasId(userId);
  }

  join(participantId: string): this {
    this.props.participantInfo = this.participantInfo.addId(participantId);

    return this;
  }

  start(): this {
    this.props.status = ShareDealStatus.START;
    this.addDomainEvent(new ShareDealStartedEvent(this.id));

    return this;
  }

  end(userId: string): Either<IllegalStateException, this> {
    if (!this.canEnd(userId)) {
      return left(new IllegalStateException('종료할 수 없습니다.'));
    }

    this.props.status = ShareDealStatus.END;
    this.addDomainEvent(new ShareDealEndedEvent(this.id));

    return right(this);
  }
}
