import { MessageType } from './MessageType';
import { UserId } from '../../../user/domain/User';

export class Message {
  static FIRST_MESSAGE =
    '채팅이 시작되었습니다.\n빠르게 배달 메뉴를 정해보세요!:)';

  static START_SHARE_DEAL_MESSAGE = [
    '공유딜이 시작되었습니다.',
    '공유딜 종료 전까지 나가기가 불가합니다.',
    '배달비 송금, 배달 음식 주문 및 공유까지 마무리된 후 공유딜을 종료해주세요:)',
    '맛있는 공유딜이 되길 바라요!',
  ].join('\n');

  static END_SHARE_DEAL_MESSAGE =
    '공유딜이 종료되었습니다.\n더이상의 채팅은 불가합니다.';

  static CLOSE_SHARE_DEAL_MESSAGE =
    '공유딜이 파기되었습니다.\n더이상의 채팅은 불가합니다.';

  private constructor(
    readonly authorId: UserId,
    readonly type: MessageType,
    readonly content: string,
    readonly unread: boolean,
  ) {}

  static of(
    authorId: UserId,
    type: MessageType,
    content: string,
    unread: boolean,
  ): Message {
    return new Message(authorId, type, content, unread);
  }

  static normal(authorId: UserId, content: string, unread: boolean): Message {
    return Message.of(authorId, MessageType.NORMAL, content, unread);
  }

  static firstMessage(authorId: UserId): Message {
    return new Message(
      authorId,
      MessageType.NOTICE,
      Message.FIRST_MESSAGE,
      false,
    );
  }

  static startShareDealMessage(authorId: UserId): Message {
    return new Message(
      authorId,
      MessageType.NOTICE,
      Message.START_SHARE_DEAL_MESSAGE,
      false,
    );
  }

  static endShareDealMessage(authorId: UserId): Message {
    return new Message(
      authorId,
      MessageType.NOTICE,
      Message.END_SHARE_DEAL_MESSAGE,
      false,
    );
  }

  static closeShareDealMessage(authorId: UserId): Message {
    return new Message(
      authorId,
      MessageType.NOTICE,
      Message.CLOSE_SHARE_DEAL_MESSAGE,
      false,
    );
  }
}
