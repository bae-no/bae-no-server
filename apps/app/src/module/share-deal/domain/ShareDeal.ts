import { E } from '@app/custom/effect';
import { AggregateRoot } from '@app/domain/entity/AggregateRoot';
import type { Branded } from '@app/domain/entity/Branded';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';

import { ShareDealClosedEvent } from './event/ShareDealClosedEvent';
import { ShareDealEndedEvent } from './event/ShareDealEndedEvent';
import { ShareDealStartedEvent } from './event/ShareDealStartedEvent';
import type { FoodCategory } from './vo/FoodCategory';
import { ParticipantInfo } from './vo/ParticipantInfo';
import { ShareDealStatus } from './vo/ShareDealStatus';
import { ShareZone } from './vo/ShareZone';
import type { UserId } from '../../user/domain/User';
import type { AddressSystem } from '../../user/domain/vo/AddressSystem';
import { NotJoinableShareDealException } from '../application/port/in/exception/NotJoinableShareDealException';

export interface ShareDealProps {
  title: string;
  status: ShareDealStatus;
  category: FoodCategory;
  orderPrice: number;
  ownerId: UserId;
  participantInfo: ParticipantInfo;
  storeName: string;
  thumbnail: string;
  zone: ShareZone;
}

export type CreateShareDealProps = Omit<
  ShareDealProps,
  'status' | 'participantInfo'
> & {
  maxParticipants: number;
};

export type UpdateShareDealProps = Omit<
  ShareDealProps,
  'status' | 'participantInfo' | 'ownerId' | 'zone'
> & {
  maxParticipants: number;
  system: AddressSystem;
  path: string;
  detail: string;
  latitude: number;
  longitude: number;
};

export type ShareDealId = Branded<string, 'ShareDealId'>;

export function ShareDealId(id: string): ShareDealId {
  return id as ShareDealId;
}

export class ShareDeal extends AggregateRoot<ShareDealProps, ShareDealId> {
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

  get ownerId(): UserId {
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
    return (
      (this.status === ShareDealStatus.OPEN ||
        this.status === ShareDealStatus.READY) &&
      this.participantInfo.hasRemaining
    );
  }

  get isActive(): boolean {
    return (
      this.status === ShareDealStatus.START ||
      this.status === ShareDealStatus.READY ||
      this.status === ShareDealStatus.OPEN
    );
  }

  static open(props: CreateShareDealProps): ShareDeal {
    const { ownerId, maxParticipants, ...otherProps } = props;

    return new ShareDeal({
      ...otherProps,
      ownerId,
      participantInfo: ParticipantInfo.of([ownerId], maxParticipants),
      status: ShareDealStatus.OPEN,
    });
  }

  canStart(userId: UserId): boolean {
    return (
      this.status === ShareDealStatus.READY &&
      userId === this.ownerId &&
      this.participantInfo.isQuorum
    );
  }

  canEnd(userId: UserId): boolean {
    return this.status === ShareDealStatus.START && userId === this.ownerId;
  }

  canWriteChat(userId: UserId): boolean {
    if (
      this.status !== ShareDealStatus.READY &&
      this.status !== ShareDealStatus.START
    ) {
      return false;
    }

    return this.participantInfo.hasId(userId);
  }

  join(participantId: UserId): E.Either<NotJoinableShareDealException, this> {
    if (!this.isJoinable) {
      return E.left(
        new NotJoinableShareDealException('입장 가능한 공유딜이 아닙니다.'),
      );
    }
    this.props.participantInfo = this.participantInfo.addId(participantId);

    if (this.participantInfo.isQuorum || this.status === ShareDealStatus.OPEN) {
      this.props.status = ShareDealStatus.READY;
    }

    return E.right(this);
  }

  start(userId: UserId): E.Either<IllegalStateException, this> {
    if (!this.canStart(userId)) {
      return E.left(new IllegalStateException('시작할 수 없습니다.'));
    }

    this.props.status = ShareDealStatus.START;
    this.addDomainEvent(new ShareDealStartedEvent(this.id));

    return E.right(this);
  }

  end(userId: UserId): E.Either<IllegalStateException, this> {
    if (!this.canEnd(userId)) {
      return E.left(new IllegalStateException('종료할 수 없습니다.'));
    }

    this.props.status = ShareDealStatus.END;
    this.addDomainEvent(new ShareDealEndedEvent(this.id));

    return E.right(this);
  }

  canUpdate(userId: UserId, maxParticipants: number): boolean {
    return (
      this.props.ownerId === userId &&
      (this.props.status === ShareDealStatus.OPEN ||
        this.props.status === ShareDealStatus.READY) &&
      this.participantInfo.isLessOrEquals(maxParticipants)
    );
  }

  update(
    userId: UserId,
    props: UpdateShareDealProps,
  ): E.Either<IllegalStateException, this> {
    if (!this.canUpdate(userId, props.maxParticipants)) {
      return E.left(new IllegalStateException('수정이 불가능한 상태입니다.'));
    }

    const zone = new ShareZone(
      props.system,
      props.path,
      props.detail,
      props.latitude,
      props.longitude,
    );
    this.props = {
      ...this.props,
      ...props,
      zone,
      participantInfo: ParticipantInfo.of(
        this.participantInfo.ids,
        props.maxParticipants,
      ),
    };

    return E.right(this);
  }

  leave(userId: UserId): E.Either<IllegalStateException, this> {
    if (this.isOwner(userId) && this.isActive) {
      this.props.status = ShareDealStatus.CLOSE;
      this.addDomainEvent(new ShareDealClosedEvent(this.id));
    }

    return this.leaveMember(userId);
  }

  private isOwner(userId: UserId): boolean {
    return this.ownerId === userId;
  }

  private leaveMember(userId: UserId): E.Either<IllegalStateException, this> {
    if (!this.participantInfo.hasId(userId)) {
      return E.left(new IllegalStateException('존재하지 않는 참가자입니다.'));
    }

    this.props.participantInfo = this.props.participantInfo.removeId(userId);

    return E.right(this);
  }
}
