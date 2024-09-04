/**
 * The type of message sent between the SDK and the iframe
 */
export enum MessageType {
  SET_TOKEN = "set-token",
  REQUEST_TOKEN = "request-token",
  OPEN_FULL_SCREEN = "open-full-screen",
  CLOSE_FULL_SCREEN = "close-full-screen",
  FULL_SCREEN_OPENED = "full-screen-opened",
  FULL_SCREEN_CLOSED = "full-screen-closed",
  FULL_SCREEN_REQUEST_DATA = "full-screen-request-data",
  FULL_SCREEN_SEND_DATA = "full-screen-send-data",
}

export type NoPayload = void | null;

/**
 * A message sent between the SDK and the iframe
 */
export interface Message {
  /**
   * The type of message
   */
  type: MessageType;
  /**
   * The payload of the message
   */
  payload: any;
}

/**
 * Set the token in the iframe
 */
export interface SetTokenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.SET_TOKEN;
  /**
   * The token to set
   */
  payload: string;
}

/**
 * Request the SDK to send the token to the iframe
 */
export interface RequestTokenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.REQUEST_TOKEN;
  /**
   * No payload is necessary
   */
  payload: NoPayload;
}

/**
 * Request the SDK to open a path in full screen
 */
export interface OpenFullScreenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.OPEN_FULL_SCREEN;
  /**
   * The path to open in full screen
   */
  payload: {
    /**
     * The path to open in full screen
     */
    path: string;

    /**
     * Additional data to send to the iframe
     */
    data?: any;
  };
}

/**
 * Request the SDK to close the full screen
 */
export interface CloseFullScreenMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.CLOSE_FULL_SCREEN;
  /**
   * No payload is necessary
   */
  payload: NoPayload;
}

/**
 * Notify the iframe that the full screen ui has been opened
 */
export interface FullScreenOpenedMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_OPENED;
  /**
   * No payload is necessary
   */
  payload: NoPayload;
}

/**
 * Notify the iframe that the full screen ui has been closed
 */
export interface FullScreenClosedMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_CLOSED;
  /**
   * No payload is necessary
   */
  payload: NoPayload;
}

/**
 * Request the SDK to transmit the data value inside of the last
 * OpenFullScreenMessage payload to the iframe.
 */
export interface FullScreenRequestDataMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_REQUEST_DATA;
  /**
   * No payload is necessary
   */
  payload: NoPayload;
}

/**
 * Send the data value inside of the last OpenFullScreenMessage payload to the iframe.
 */
export interface FullScreenSendDataMessage extends Message {
  /**
   * @inheritdoc
   */
  type: MessageType.FULL_SCREEN_SEND_DATA;
  /**
   * The data to send
   */
  payload: any;
}
