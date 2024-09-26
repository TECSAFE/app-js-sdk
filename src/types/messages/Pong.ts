import { MessageType } from '../MessageType'
import { Message } from './Message'

/**
 * Respond to a ping message from the target, which can be either the SDK or the iframe
 */
export interface PongMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.PONG
  /**
   * The current version of the sender. Expected to be semantically versioned or the string 'IN-DEV'.
   */
  payload: string
}
