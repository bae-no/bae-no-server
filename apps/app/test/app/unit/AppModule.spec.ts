import { PrismaService } from '@app/prisma/PrismaService';
import { PushMessageAdapter } from '@app/push-message/PushMessageAdapter';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/AppModule';

describe('AppModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'secret';
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(PushMessageAdapter)
      .useValue({})
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  describe('start', () => {
    it('서버가 정상적으로 실행된다', async () => {
      expect(app).toBeTruthy();
    });
  });
});
