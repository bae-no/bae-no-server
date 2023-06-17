import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { BUSINESS_MODULES } from '../../../src/AppModule';
import { TestInfraModule } from '../../fixture/TestInfraModule';

describe('AppModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'secret';
    const module = await Test.createTestingModule({
      imports: [TestInfraModule, ...BUSINESS_MODULES],
    }).compile();

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
