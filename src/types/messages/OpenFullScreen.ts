import { MessageType } from '../MessageType'
import { Message } from './Message'

/**
 * Request the SDK to open a path in full screen
 */
export interface OpenFullScreenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.OPEN_FULL_SCREEN
  /**
   * The url to open in full screen
   */
  payload: string
}
