import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Request the SDK to send the meta data to the iframe
 */
export interface MetaRequestMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.META_REQUEST_DATA
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
