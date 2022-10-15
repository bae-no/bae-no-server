import { MessageType } from './MessageType';

export class Message {
  static FIRST_MESSAGE =
    '채팅이 시작되었습니다.\n빠르게 배달 메뉴를 정해보세요!:)';

  static START_SHARE_DEAL_MESSAGE = [
    '공유딜이 시작되었습니다.',
    '공유딜 종료 전까지 나가기가 불가합니다.',
    '배달비 송금, 배달 음식 주문 및 공유까지 마무리된 후 공유딜을 종료해주세요:)',
    '맛있는 공유딜이 되길 바라요!',
  ].join('\n');

  private constructor(
    readonly authorId: string,
    readonly type: MessageType,
    readonly content: string,
  ) {}

  static of(authorId: string, type: MessageType, content: string): Message {
    return new Message(authorId, type, content);
  }

  static normal(authorId: string, content: string): Message {
    return new Message(authorId, MessageType.NORMAL, content);
  }

  static firstMessage(authorId: string): Message {
    return new Message(authorId, MessageType.NOTICE, Message.FIRST_MESSAGE);
  }

  static startShareDealMessage(authorId: string): Message {
    return new Message(
      authorId,
      MessageType.NOTICE,
      Message.START_SHARE_DEAL_MESSAGE,
    );
  }
}
