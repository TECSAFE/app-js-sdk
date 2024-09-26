import { MessageType } from '../MessageType'
import { Message } from './Message'

/**
 * Request a pong message from the target, which can be either the SDK or the iframe
 */
export interface PingMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.PING
  /**
   * The current version of the sender. Expected to be semantically versioned or the string 'IN-DEV'.
   */
  payload: string
}
