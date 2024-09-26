import { MessageType } from '../MessageType'
import { Message } from './Message'
import { OfcpConfig } from '../Config'

/**
 * Send the styles configuration object from the OfcpConfig to the iframe.
 */
export interface StylesSendDataMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.STYLES_SEND_DATA
  /**
   * The styles configuration object
   */
  payload: typeof OfcpConfig.prototype.styles
}
