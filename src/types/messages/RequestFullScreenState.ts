import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Request the sdk to send the full screen state to the iframe
 */
export interface RequestFullScreenStateMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.REQUEST_FULL_SCREEN_STATE
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
