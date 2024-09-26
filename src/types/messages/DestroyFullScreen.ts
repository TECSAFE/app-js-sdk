import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Request the SDK to destroy the full screen ui (aka AppWidget)
 */
export interface DestroyFullScreenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.DESTROY_FULL_SCREEN
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
