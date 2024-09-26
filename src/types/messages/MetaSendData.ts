import { MessageType } from '../MessageType'
import { Message } from './Message'

/**
 * Send the meta data to the iframe
 */
export interface MetaSendDataMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.META_SEND_DATA
  /**
   * The meta data object
   */
  payload: {
    /**
     * The list of events the parent has registered listeners for.
     */
    registeredEvents: string[]
  }
}
