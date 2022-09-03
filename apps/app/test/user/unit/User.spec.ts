import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertLeft, assertRight, expectNonNullable } from '../../fixture';

describe('User', () => {
  describe('updateByPhoneVerification', () => {
    it('인증번호가 검증에 실패하면 에러를 반환한다', () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      const verification = PhoneVerification.of('01011112222', '1234');

      // when
      const result = user.updateByPhoneVerification(verification, '1245');

      // then
      assertLeft(result, (err) => {
        expect(err.message).toContain('코드가 일치하지 않습니다');
        expect(user.phoneNumber).toBeFalsy();
      });
    });

    it('인증번호 검증에 성공하면 전화번호를 변경한다', () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      const verification = PhoneVerification.of('01011112222');

      // when
      const result = user.updateByPhoneVerification(
        verification,
        verification.code,
      );

      // then
      assertRight(result, (value) => {
        expect(value.phoneNumber).toBe(verification.phoneNumber);
      });
    });
  });

  describe('leave', () => {
    it('탈퇴처리 시 인증정보 해제하고 탈퇴사유를 기록한다', () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);

      // when
      user.leave('name', 'reason', new Date());

      // then
      expect(user.auth.socialId).toBe('');
      expectNonNullable(user.leaveReason);
      expect(user.leaveReason.name).toBe('name');
      expect(user.leaveReason.reason).toBe('reason');
    });
  });
});
