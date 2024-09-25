import { OfcpConfig } from './Config'

/**
 * The type of message sent between the SDK and the iframe
 */
export enum MessageType {
  PING = 'tecsafe-ofcp-ping',
  PONG = 'tecsafe-ofcp-pong',
  SET_TOKEN = 'set-token',
  REQUEST_TOKEN = 'request-token',
  OPEN_FULL_SCREEN = 'open-full-screen',
  CLOSE_FULL_SCREEN = 'close-full-screen',
  DESTROY_FULL_SCREEN = 'destroy-full-screen',
  FULL_SCREEN_OPENED = 'full-screen-opened',
  FULL_SCREEN_CLOSED = 'full-screen-closed',
  REQUEST_FULL_SCREEN_STATE = 'request-full-screen-state',
  UPDATE_FULL_SCREEN_URL = 'update-full-screen-url',
  STYLES_REQUEST_DATA = 'styles-request-data',
  STYLES_SEND_DATA = 'styles-send-data',
}

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

/**
 * Request the SDK to close the full screen
 */
export interface CloseFullScreenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.CLOSE_FULL_SCREEN
  /**
   * No payload is necessary
   */
  payload: NoPayload
}

/**
 * Request the SDK to destroy the full screen ui (aka AppWidget)
 */
export interface DestroyFullScreenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.DESTROY_FULL_SCREEN
  /**
   * No payload is necessary
   */
  payload: NoPayload
}

/**
 * Notify the iframe that the full screen ui has been opened
 */
export interface FullScreenOpenedMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_OPENED
  /**
   * No payload is necessary
   */
  payload: NoPayload
}

/**
 * Notify the iframe that the full screen ui has been closed
 */
export interface FullScreenClosedMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_CLOSED
  /**
   * No payload is necessary
   */
  payload: NoPayload
}

/**
 * Request the sdk to send the full screen state to the iframe
 */
export interface RequestFullScreenStateMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.REQUEST_FULL_SCREEN_STATE
  /**
   * No payload is necessary
   */
  payload: NoPayload
}

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
