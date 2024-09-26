import { MessageType } from '../MessageType'
import { Message, NoPayload } from './Message'

/**
 * Request the sdk to transmit the styles configuration object from the OfcpConfig to the iframe.
 */
export interface StylesRequestMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.STYLES_REQUEST_DATA
  /**
   * No payload is necessary
   */
  payload: NoPayload
}
