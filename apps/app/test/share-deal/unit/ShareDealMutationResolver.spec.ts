import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { CreateShareZoneInput } from '../../../src/module/share-deal/adapter/in/gql/input/CreateShareZoneInput';
import { OpenShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/OpenShareDealInput';
import { ShareDealMutationResolver } from '../../../src/module/share-deal/adapter/in/gql/ShareDealMutationResolver';
import { ShareDealCommandUseCase } from '../../../src/module/share-deal/application/port/in/ShareDealCommandUseCase';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';

describe('ShareDealMutationResolver', () => {
  const sharedDealCommandUseCase = mock<ShareDealCommandUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        ShareDealMutationResolver,
        {
          provide: ShareDealCommandUseCase,
          useValue: sharedDealCommandUseCase,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  beforeEach(() => mockReset(sharedDealCommandUseCase));

  describe('openShareDeal', () => {
    it('공유딜을 생성한다.', async () => {
      // given
      const input = new OpenShareDealInput();
      input.title = 'PIIIIIIIIZZA';
      input.category = FoodCategory.BURGER;
      input.minParticipants = 2;
      input.storeName = 'IPPPPPPPPPAAZ';
      input.orderPrice = 1000;

      const shareZoneInput = new CreateShareZoneInput();
      shareZoneInput.addressDetail = 'detail';
      shareZoneInput.addressRoad = 'road';
      shareZoneInput.longitude = 100;
      shareZoneInput.latitude = 50;
      input.shareZone = shareZoneInput;

      // language=GraphQL
      const mutation = `mutation openShareDeal($input: OpenShareDealInput!) {
        openShareDeal(input: $input)
      }`;

      sharedDealCommandUseCase.open.mockReturnValue(right(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "openShareDeal": true,
          },
        }
      `);
    });
  });
});
