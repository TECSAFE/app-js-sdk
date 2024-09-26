import { MessageType } from '../MessageType'
import { Message } from './Message'

/**
 * Set the token in the iframe
 */
export interface SetTokenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.SET_TOKEN
  /**
   * The token to set
   */
  payload: string
}
