import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Notify the iframe that the full screen ui has been opened
 */
export interface FullScreenOpenedMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_OPENED
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
