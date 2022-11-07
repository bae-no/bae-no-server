import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { ChatQueryRepositoryAdapter } from '../../../src/module/chat/adapter/out/persistence/ChatQueryRepositoryAdapter';
import { MessageType } from '../../../src/module/chat/domain/vo/MessageType';
import {
  assertNone,
  assertResolvesRight,
  assertSome,
} from '../../fixture/utils';

describe('ChatQueryRepositoryAdapter', () => {
  let chatQueryRepositoryAdapter: ChatQueryRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatQueryRepositoryAdapter, PrismaService],
    }).compile();

    chatQueryRepositoryAdapter = module.get(ChatQueryRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.shareDeal.deleteMany()]));

  describe('last', () => {
    it('작성된 채팅이 없는 경우 빈 채팅 목록이 반환된다.', async () => {
      // given
      const shareDealId = faker.database.mongodbObjectId();
      const userId = faker.database.mongodbObjectId();

      // when
      const result = chatQueryRepositoryAdapter.last(shareDealId, userId);

      // then
      await assertResolvesRight(result, (deals) => {
        assertNone(deals);
      });
    });

    it('채팅방에 작성된 마지막 메시지를 조회한다.', async () => {
      // given
      const shareDealId = faker.database.mongodbObjectId();
      const userId = faker.database.mongodbObjectId();
      await prisma.chat.createMany({
        data: [
          {
            createdAt: new Date('2022-10-05'),
            userId,
            shareDealId,
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
      await assertResolvesRight(result, (chat) => {
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
      const userId = faker.database.mongodbObjectId();

      // when
      const result = chatQueryRepositoryAdapter.unreadCount(
        shareDealId,
        userId,
      );

      // then
      await assertResolvesRight(result, (deals) => {
        expect(deals).toBe(0);
      });
    });

    it('채팅방의 안읽은 메시지의 개수를 조회한다.', async () => {
      // given
      const shareDealId = faker.database.mongodbObjectId();
      const userId = faker.database.mongodbObjectId();

      await prisma.chat.createMany({
        data: [true, true, false, true].map((unread) => ({
          userId,
          shareDealId,
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
        shareDealId,
        userId,
      );

      // then
      await assertResolvesRight(result, (count) => {
        expect(count).toBe(3);
      });
    });
  });
});
