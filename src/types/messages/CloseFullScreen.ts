import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Request the SDK to close the full screen
 */
export interface CloseFullScreenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.CLOSE_FULL_SCREEN
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
