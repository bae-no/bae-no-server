import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { addSeconds } from 'date-fns';

import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';

describe('PhoneVerification', () => {
  describe('verify', () => {
    it('주어진 code 와 일치하지 않으면 에러가 발생한다', () => {
      // given
      const verification = new PhoneVerification(
        '01011112222',
        '1234',
        new Date(),
      );

      // when
      const verify = () => verification.verify('5678');

      // then
      expect(verify).toThrow(IllegalStateException);
    });

    it('만료되었다면 code 와 일치해도 만료된 경우 에러가 발생한다', () => {
      // given
      const now = new Date();
      const verification = new PhoneVerification('01011112222', '1234', now);

      // when
      const verify = () => verification.verify('1234', addSeconds(now, 1));

      // then
      expect(verify).toThrow(IllegalStateException);
    });

    it('주어진 code 와 일치하고 만료되지 않으면 성공한다', () => {
      // given
      const verification = new PhoneVerification(
        '01011112222',
        '1234',
        new Date('2022-03-03 12:00:00'),
      );

      // when
      const verify = () =>
        verification.verify('1234', new Date('2022-03-03 11:59:59'));

      // then
      expect(verify).not.toThrow();
    });
  });
});
