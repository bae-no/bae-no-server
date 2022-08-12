import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { addSeconds } from 'date-fns';

import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';

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
      const verify = () => verification.verify(verification.code + '1233');

      // then
      expect(verify).toThrow(IllegalStateException);
    });

    it('만료되었다면 code 와 일치해도 만료된 경우 에러가 발생한다', () => {
      // given
      const verification = PhoneVerification.of('01011112222');

      // when
      const verify = () =>
        verification.verify(
          verification.code,
          addSeconds(verification.expiredAt, 1),
        );

      // then
      expect(verify).toThrow(IllegalStateException);
    });

    it('주어진 code 와 일치하고 만료되지 않으면 성공한다', () => {
      // given
      const verification = PhoneVerification.of('01011112222');

      // when
      const verify = () => verification.verify(verification.code, new Date());

      // then
      expect(verify).not.toThrow();
    });
  });
});
