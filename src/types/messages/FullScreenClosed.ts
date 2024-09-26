import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Notify the iframe that the full screen ui has been closed
 */
export interface FullScreenClosedMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_CLOSED
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
