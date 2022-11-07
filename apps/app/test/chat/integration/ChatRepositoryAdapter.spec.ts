import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { ChatRepositoryAdapter } from '../../../src/module/chat/adapter/out/persistence/ChatRepositoryAdapter';
import { Chat } from '../../../src/module/chat/domain/Chat';
import { Message } from '../../../src/module/chat/domain/vo/Message';
import { assertResolvesRight } from '../../fixture/utils';

describe('ChatRepositoryAdapter', () => {
  let chatRepositoryAdapter: ChatRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRepositoryAdapter, PrismaService],
    }).compile();

    chatRepositoryAdapter = module.get(ChatRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.shareDeal.deleteMany()]));

  describe('create', () => {
    it('주어진 채팅을 생성한다', async () => {
      // given
      const chats = [
        Chat.of({
          shareDealId: faker.database.mongodbObjectId(),
          userId: faker.database.mongodbObjectId(),
          message: Message.firstMessage(faker.database.mongodbObjectId()),
        }),
        Chat.of({
          shareDealId: faker.database.mongodbObjectId(),
          userId: faker.database.mongodbObjectId(),
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
});
