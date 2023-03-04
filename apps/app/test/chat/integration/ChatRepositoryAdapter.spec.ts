import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { ChatOrmMapper } from '../../../src/module/chat/adapter/out/persistence/ChatOrmMapper';
import { ChatRepositoryAdapter } from '../../../src/module/chat/adapter/out/persistence/ChatRepositoryAdapter';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { UserId } from '../../../src/module/user/domain/User';
import { assertResolvesSuccess } from '../../fixture/utils';

describe('ChatRepositoryAdapter', () => {
  const prisma = new PrismaService();
  const chatRepositoryAdapter = new ChatRepositoryAdapter(prisma);

  beforeEach(async () => {
    await prisma.$transaction([prisma.chat.deleteMany()]);
  });

  describe('create', () => {
    it('주어진 채팅을 생성한다', async () => {
      // given
      const chats = [
        Chat.of({
          shareDealId: ShareDealId(faker.database.mongodbObjectId()),
          userId: UserId(faker.database.mongodbObjectId()),
          orderedKey: faker.random.numeric(),
          message: Message.firstMessage(
            UserId(faker.database.mongodbObjectId()),
          ),
        }),
        Chat.of({
          shareDealId: ShareDealId(faker.database.mongodbObjectId()),
          userId: UserId(faker.database.mongodbObjectId()),
          orderedKey: faker.random.numeric(),
          message: Message.startShareDealMessage(
            UserId(faker.database.mongodbObjectId()),
          ),
        }),
      ];

      // when
      const result = chatRepositoryAdapter.create(chats);

      // then
      await assertResolvesSuccess(result, (value) => {
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
      const shareDealId = ShareDealId(faker.database.mongodbObjectId());
      const userId = UserId(faker.database.mongodbObjectId());
      const chats = [
        Chat.of({
          shareDealId,
          userId,
          orderedKey: faker.random.numeric(),
          message: Message.normal(
            UserId(faker.database.mongodbObjectId()),
            'content 1',
            true,
          ),
        }),
        Chat.of({
          shareDealId,
          userId,
          orderedKey: faker.random.numeric(),
          message: Message.normal(
            UserId(faker.database.mongodbObjectId()),
            'content 2',
            true,
          ),
        }),
      ];
      await prisma.chat.createMany({ data: chats.map(ChatOrmMapper.toOrm) });

      // when
      const result = chatRepositoryAdapter.updateRead(shareDealId, userId);

      // then
      await assertResolvesSuccess(result);
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
