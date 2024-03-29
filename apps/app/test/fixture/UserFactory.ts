import { faker } from '@faker-js/faker';

import type { UserProps } from '../../src/module/user/domain/User';
import { User, UserId } from '../../src/module/user/domain/User';
import { Agreement } from '../../src/module/user/domain/vo/Agreement';
import { Auth } from '../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../src/module/user/domain/vo/AuthType';
import { Profile } from '../../src/module/user/domain/vo/Profile';
import { UserAddressList } from '../../src/module/user/domain/vo/UserAddressList';

type BaseType = {
  id?: UserId;
  createdAt: Date;
  updatedAt: Date;
};

export class UserFactory {
  static create(props: Partial<UserProps & BaseType> = {}): User {
    const auth = new Auth(
      faker.string.alphanumeric(10),
      faker.helpers.arrayElement(Object.values(AuthType)),
    );

    return new User({
      auth,
      nickname: faker.person.firstName(),
      addressList: props.addressList ?? UserAddressList.of(),
      phoneNumber: faker.phone.number(),
      agreement: new Agreement(
        faker.datatype.boolean(),
        faker.datatype.boolean(),
      ),
      profile: new Profile(faker.internet.url(), faker.lorem.sentence()),
      leaveReason: null,
      ...props,
    }).setBase(
      UserId(props.id ?? faker.database.mongodbObjectId()),
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
