import { registerEnumType } from '@nestjs/graphql';

import { AuthType } from '../../../../user/domain/vo/AuthType';

registerEnumType(AuthType, { name: 'AuthType', description: '로그인 유형' });
