import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Request the SDK to send the token to the iframe
 */
export interface RequestTokenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.REQUEST_TOKEN
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
