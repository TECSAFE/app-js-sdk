import { MessageType } from '../MessageType'
import { Message } from './Message'

/**
 * Request the sdk to change the height of the iframe.
 */
export interface SizeUpdateMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.SIZE_UPDATE
  /**
   * The height in pixels.
   */
  payload: number
}
