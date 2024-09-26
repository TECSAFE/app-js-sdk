import { MessageType } from '../MessageType'
import { Message } from './Message'

/**
 * Request the SDK to call a parent event with the given name and payload
 * @see {@link TecsafeApi.addEventListener}
 */
export interface CallParentEventMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.CALL_PARENT_EVENT
  /**
   * The event name and arguments to pass to the event
   */
  payload: {
    /**
     * The name of the event to call
     */
    event: string
    /**
     * The arguments to pass to the event
     */
    args?: any[]
  }
}
