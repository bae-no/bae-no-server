import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';

describe('ParticipantInfo', () => {
  it('참여자 정보를 생성한다', () => {
    // given
    const ids = ['1', '2', '3'];
    const min = 10;

    // when
    const result = ParticipantInfo.of(ids, min);

    // then
    expect(result.ids).toBe(ids);
    expect(result.min).toBe(min);
    expect(result.current).toBe(ids.length);
    expect(result.remaining).toBe(7);
  });

  it('참여자를 추가한다', () => {
    // given
    const info = ParticipantInfo.of(['1'], 3);

    // when
    const newInfo = info.addId('4');

    // then
    expect(newInfo.ids).toEqual(['1', '4']);
    expect(newInfo.min).toBe(3);
    expect(newInfo.current).toBe(2);
    expect(newInfo.remaining).toBe(1);
  });
});
