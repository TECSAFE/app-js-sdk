import { MessageType } from '../MessageType'

export type NoPayload = void | null

/**
 * A message sent between the SDK and the iframe
 */
export interface Message {
  /**
   * The type of message
   */
  type: MessageType
  /**
   * The payload of the message
   */
  payload: any
}
