import { faker } from '@faker-js/faker';

import { Chat, ChatProps } from '../../src/module/chat/domain/Chat';
import { Message } from '../../src/module/chat/domain/vo/Message';
import { MessageType } from '../../src/module/chat/domain/vo/MessageType';

type BaseType = {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ChatFactory {
  static create(props: Partial<ChatProps & BaseType> = {}): Chat {
    const message = Message.of(
      faker.database.mongodbObjectId(),
      faker.helpers.arrayElement([MessageType.NORMAL, MessageType.NOTICE]),
      faker.lorem.sentence(),
      faker.datatype.boolean(),
    );

    return new Chat({
      shareDealId: faker.database.mongodbObjectId(),
      userId: faker.database.mongodbObjectId(),
      timestamp: faker.datatype.number(),
      message,
      ...props,
    }).setBase(
      props.id ?? faker.database.mongodbObjectId(),
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
