import { faker } from '@faker-js/faker';

import { User, UserProps } from '../../src/module/user/domain/User';
import { Agreement } from '../../src/module/user/domain/vo/Agreement';
import { Auth } from '../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../src/module/user/domain/vo/AuthType';
import { Profile } from '../../src/module/user/domain/vo/Profile';
import { UserAddressList } from '../../src/module/user/domain/vo/UserAddressList';

type BaseType = {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserFactory {
  static create(props: Partial<UserProps & BaseType> = {}): User {
    const auth = new Auth(
      faker.random.alphaNumeric(10),
      faker.helpers.arrayElement(Object.values(AuthType)),
    );

    return new User({
      auth,
      nickname: faker.name.firstName(),
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
      props.id ?? faker.database.mongodbObjectId(),
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
