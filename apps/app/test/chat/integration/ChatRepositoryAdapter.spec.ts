import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';

import { ChatOrmMapper } from '../../../src/module/chat/adapter/out/persistence/ChatOrmMapper';
import { ChatRepositoryAdapter } from '../../../src/module/chat/adapter/out/persistence/ChatRepositoryAdapter';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { assertResolvesRight } from '../../fixture/utils';

describe('ChatRepositoryAdapter', () => {
  const prisma = new PrismaService();
  const chatRepositoryAdapter = new ChatRepositoryAdapter(prisma);

  beforeEach(async () => prisma.$transaction([prisma.chat.deleteMany()]));

  describe('create', () => {
    it('주어진 채팅을 생성한다', async () => {
      // given
      const chats = [
        Chat.of({
          shareDealId: faker.database.mongodbObjectId(),
          userId: faker.database.mongodbObjectId(),
          timestamp: faker.datatype.bigInt(),
          message: Message.firstMessage(faker.database.mongodbObjectId()),
        }),
        Chat.of({
          shareDealId: faker.database.mongodbObjectId(),
          userId: faker.database.mongodbObjectId(),
          timestamp: faker.datatype.bigInt(),
          message: Message.startShareDealMessage(
            faker.database.mongodbObjectId(),
          ),
        }),
      ];

      // when
      const result = chatRepositoryAdapter.create(chats);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(2);
        value.forEach((v, i) => {
          expect(v.userId).toBe(chats[i].userId);
          expect(v.shareDealId).toBe(chats[i].shareDealId);
          expect(v.message.type).toBe(chats[i].message.type);
          expect(v.message.authorId).toBe(chats[i].message.authorId);
        });
      });
    });
  });

  describe('updateRead', () => {
    it('주어진 채팅을 모두 읽음처리한다', async () => {
      // given
      const shareDealId = faker.database.mongodbObjectId();
      const userId = faker.database.mongodbObjectId();
      const chats = [
        Chat.of({
          shareDealId,
          userId,
          timestamp: 1000n,
          message: Message.normal(
            faker.database.mongodbObjectId(),
            'content 1',
            true,
          ),
        }),
        Chat.of({
          shareDealId,
          userId,
          timestamp: 1000n,
          message: Message.normal(
            faker.database.mongodbObjectId(),
            'content 2',
            true,
          ),
        }),
      ];
      await prisma.chat.createMany({ data: chats.map(ChatOrmMapper.toOrm) });

      // when
      const result = chatRepositoryAdapter.updateRead(shareDealId, userId);

      // then
      await assertResolvesRight(result);
      const updated = await prisma.chat.findMany({
        where: { shareDealId, userId },
      });
      expect(updated).toHaveLength(2);
      updated.forEach((v) => {
        expect(v.message.unread).toBe(false);
      });
    });
  });
});
