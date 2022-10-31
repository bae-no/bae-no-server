import { addSeconds } from 'date-fns';

import { ExpiredCodeException } from '../../../src/module/user/domain/exception/ExpiredCodeException';
import { MismatchedCodeException } from '../../../src/module/user/domain/exception/MismatchedCodeException';
import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';
import { assertLeft, assertRight } from '../../fixture';

describe('PhoneVerification', () => {
  describe('of', () => {
    it('임의의 코드와 만료일자를 설정한다', () => {
      // when
      const verification = PhoneVerification.of('01011112222');

      // then
      expect(verification.code).toMatch(/^\d{4}$/);
      expect(verification.expiredAt).toBeInstanceOf(Date);
    });
  });

  describe('verify', () => {
    it('주어진 code 와 일치하지 않으면 에러가 발생한다', () => {
      // given
      const verification = PhoneVerification.of('01011112222');

      // when
      const result = verification.verify(verification.code + '1233');

      // then
      assertLeft(result, (err) => {
        expect(err).toBeInstanceOf(MismatchedCodeException);
        expect(err.message).toContain('코드가 일치하지 않습니다');
      });
    });

    it('만료되었다면 code 와 일치해도 만료된 경우 에러가 발생한다', () => {
      // given
      const verification = PhoneVerification.of('01011112222');

      // when
      const result = verification.verify(
        verification.code,
        addSeconds(verification.expiredAt, 1),
      );

      // then
      assertLeft(result, (err) => {
        expect(err).toBeInstanceOf(ExpiredCodeException);
        expect(err.message).toContain('코드가 만료되었습니다');
      });
    });

    it('주어진 code 와 일치하고 만료되지 않으면 성공한다', () => {
      // given
      const verification = PhoneVerification.of('01011112222');

      // when
      const result = verification.verify(verification.code, new Date());

      // then
      assertRight(result);
    });
  });
});
