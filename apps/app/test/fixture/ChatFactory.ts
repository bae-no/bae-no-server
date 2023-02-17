import { faker } from '@faker-js/faker';

import type { ChatProps } from '../../src/module/chat/domain/Chat';
import { Chat, ChatId } from '../../src/module/chat/domain/Chat';
import { Message } from '../../src/module/chat/domain/vo/Message';
import { MessageType } from '../../src/module/chat/domain/vo/MessageType';
import { ShareDealId } from '../../src/module/share-deal/domain/ShareDeal';
import { UserId } from '../../src/module/user/domain/User';

type BaseType = {
  id?: ChatId;
  createdAt: Date;
  updatedAt: Date;
};

export class ChatFactory {
  static create(props: Partial<ChatProps & BaseType> = {}): Chat {
    const message = Message.of(
      UserId(faker.database.mongodbObjectId()),
      faker.helpers.arrayElement([MessageType.NORMAL, MessageType.NOTICE]),
      faker.lorem.sentence(),
      faker.datatype.boolean(),
    );

    return new Chat({
      shareDealId: ShareDealId(faker.database.mongodbObjectId()),
      userId: UserId(faker.database.mongodbObjectId()),
      orderedKey: faker.random.numeric(),
      message,
      ...props,
    }).setBase(
      ChatId(props.id ?? faker.database.mongodbObjectId()),
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
