import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { ChatOrmMapper } from '../../../src/module/chat/adapter/out/persistence/ChatOrmMapper';
import { ChatQueryRepositoryAdapter } from '../../../src/module/chat/adapter/out/persistence/ChatQueryRepositoryAdapter';
import { FindChatByUserCommand } from '../../../src/module/chat/application/port/in/dto/FindChatByUserCommand';
import { MessageType } from '../../../src/module/chat/domain/vo/MessageType';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { UserId } from '../../../src/module/user/domain/User';
import { ChatFactory } from '../../fixture/ChatFactory';
import {
  assertNone,
  assertResolvesSuccess,
  assertSome,
} from '../../fixture/utils';

describe('ChatQueryRepositoryAdapter', () => {
  const prisma = new PrismaService();
  const chatQueryRepositoryAdapter = new ChatQueryRepositoryAdapter(prisma);

  beforeAll(async () => prisma.$connect());

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => {
    await prisma.$transaction([prisma.shareDeal.deleteMany()]);
  });

  describe('last', () => {
    it('작성된 채팅이 없는 경우 빈 채팅 목록이 반환된다.', async () => {
      // given
      const shareDealId = ShareDealId(faker.database.mongodbObjectId());
      const userId = UserId(faker.database.mongodbObjectId());

      // when
      const result = chatQueryRepositoryAdapter.last(shareDealId, userId);

      // then
      await assertResolvesSuccess(result, (deals) => {
        assertNone(deals);
      });
    });

    it('채팅방에 작성된 마지막 메시지를 조회한다.', async () => {
      // given
      const shareDealId = ShareDealId(faker.database.mongodbObjectId());
      const userId = UserId(faker.database.mongodbObjectId());
      await prisma.chat.createMany({
        data: [
          {
            createdAt: new Date('2022-10-05'),
            userId,
            shareDealId,
            orderedKey: faker.string.numeric(),
            message: {
              type: MessageType.NORMAL,
              content: 'last',
              authorId: userId,
              unread: false,
            },
          },
          {
            createdAt: new Date('2022-10-01'),
            userId,
            shareDealId,
            orderedKey: faker.string.numeric(),
            message: {
              type: MessageType.NORMAL,
              content: 'first',
              authorId: userId,
              unread: false,
            },
          },
        ],
      });

      // when
      const result = chatQueryRepositoryAdapter.last(shareDealId, userId);

      // then
      await assertResolvesSuccess(result, (chat) => {
        assertSome(chat, (chat) => {
          expect(chat.content).toBe('last');
        });
      });
    });
  });

  describe('unreadCount', () => {
    it('작성된 채팅이 없는 경우 0이 반환된다.', async () => {
      // given
      const shareDealId = faker.database.mongodbObjectId();
      const userId = UserId(faker.database.mongodbObjectId());

      // when
      const result = chatQueryRepositoryAdapter.unreadCount(
        ShareDealId(shareDealId),
        userId,
      );

      // then
      await assertResolvesSuccess(result, (deals) => {
        expect(deals).toBe(0);
      });
    });

    it('채팅방의 안읽은 메시지의 개수를 조회한다.', async () => {
      // given
      const shareDealId = faker.database.mongodbObjectId();
      const userId = UserId(faker.database.mongodbObjectId());

      await prisma.chat.createMany({
        data: [true, true, false, true].map((unread) => ({
          userId,
          shareDealId,
          orderedKey: faker.string.numeric(),
          message: {
            type: MessageType.NORMAL,
            content: 'message',
            authorId: userId,
            unread,
          },
        })),
      });

      // when
      const result = chatQueryRepositoryAdapter.unreadCount(
        ShareDealId(shareDealId),
        userId,
      );

      // then
      await assertResolvesSuccess(result, (count) => {
        expect(count).toBe(3);
      });
    });
  });

  describe('findByUser', () => {
    it('주어진 사용자의 채팅목록을 가져온다', async () => {
      // given
      const shareDealId = ShareDealId(faker.database.mongodbObjectId());
      const userId = UserId(faker.database.mongodbObjectId());
      const chats = [
        ChatFactory.create({
          shareDealId,
          orderedKey: '100',
          userId,
        }),
        ChatFactory.create({
          shareDealId,
          userId,
          orderedKey: '200',
        }),
      ];
      await prisma.chat.createMany({ data: chats.map(ChatOrmMapper.toOrm) });
      const command = new FindChatByUserCommand(shareDealId, userId);

      // when
      const result = chatQueryRepositoryAdapter.findByUser(command);

      // then
      await assertResolvesSuccess(result, (result) => {
        expect(result.length).toBe(2);
        expect(result[0].orderedKey).toBe(chats[1].orderedKey);
        expect(result[1].orderedKey).toBe(chats[0].orderedKey);
      });
    });

    it('지정한 key 보다 작은 항목들만 가져온다', async () => {
      // given
      const shareDealId = ShareDealId(faker.database.mongodbObjectId());
      const userId = UserId(faker.database.mongodbObjectId());
      const chats = [
        ChatFactory.create({
          shareDealId,
          orderedKey: '100',
          userId,
        }),
        ChatFactory.create({
          shareDealId,
          userId,
          orderedKey: '200',
        }),
      ];
      await prisma.chat.createMany({ data: chats.map(ChatOrmMapper.toOrm) });
      const command = new FindChatByUserCommand(shareDealId, userId, '200');

      // when
      const result = chatQueryRepositoryAdapter.findByUser(command);

      // then
      await assertResolvesSuccess(result, (result) => {
        expect(result.length).toBe(1);
        expect(result[0].orderedKey).toBe(chats[0].orderedKey);
      });
    });
  });
});
