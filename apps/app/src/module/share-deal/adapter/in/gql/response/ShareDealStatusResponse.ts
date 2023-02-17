import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Field, ObjectType } from '@nestjs/graphql';

import { ShareDealParticipantResponse } from './ShareDealParticipantResponse';
import type { User, UserId } from '../../../../../user/domain/User';
import type { ShareDeal } from '../../../../domain/ShareDeal';

@ObjectType()
export class ShareDealStatusResponse {
  @Field()
  canStart: boolean;

  @Field()
  canEnd: boolean;

  @Field({ description: 'api 요청한 사람이 방장인지 여부' })
  isOwner: boolean;

  @Field(() => [ShareDealParticipantResponse])
  participants: ShareDealParticipantResponse[];

  static of(shareDeal: ShareDeal, users: User[], userId: UserId) {
    const response = new ShareDealStatusResponse();
    response.canStart = shareDeal.canStart(shareDeal.ownerId);
    response.canEnd = shareDeal.canEnd(shareDeal.ownerId);
    response.isOwner = shareDeal.ownerId === userId;
    response.participants = shareDeal.participantInfo.ids.map((id) => {
      const user = users.find((user) => user.id === id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return ShareDealParticipantResponse.of(
        user,
        user.id === userId,
        user.id === shareDeal.ownerId,
      );
    });

    return response;
  }
}
