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
  META_REQUEST_DATA = 'meta-request-data',
  META_SEND_DATA = 'meta-send-data',
  CALL_PARENT_EVENT = 'call-parent-event',
  SIZE_UPDATE = 'size-update',
}
