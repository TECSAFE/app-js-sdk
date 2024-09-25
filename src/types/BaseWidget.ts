import { TecsafeApi } from '../TecsafeApi'
import { SDK_VERSION } from '../util/Version'
import { OfcpConfig } from './Config'
import {
  FullScreenClosedMessage,
  FullScreenOpenedMessage,
  Message,
  MessageType,
  OpenFullScreenMessage,
  PongMessage,
  SetTokenMessage,
  StylesSendDataMessage,
} from './Messages'

/**
 * Base class for all widgets, providing common functionality
 */
export class BaseWidget {
  constructor(
    protected readonly config: OfcpConfig,
    protected el: HTMLElement,
    protected readonly api: TecsafeApi
  ) {}

  /**
   * The iframe element
   */
  protected iframe: HTMLIFrameElement | null = null

  /**
   * Gets the iframe element
   * @returns The iframe element or null if it doesn't exist currently
   */
  public getIframe(): HTMLIFrameElement | null {
    return this.iframe
  }

  /**
   * The path to the iframe which will be appended to the uiBaseURL to get the full URL
   */
  protected readonly uiPath: string = 'iframe'

  /**
   * Sends a message to the iframe
   * @param message The message to send
   * @returns void
   */
  public sendMessage(message: Message): void {
    if (!this.iframe) return
    const iframeSrc = new URL(this.iframe.src)
    const origin = iframeSrc.origin
    if (!this.config.allowedOrigins.includes(origin)) {
      console.error(
        '[OFCP] Widget',
        this.el,
        'cannot send message to origin',
        origin
      )
      return
    }
    this.iframe.contentWindow?.postMessage(message, origin)
  }

  /**
   * Handles messages from the iframe
   * @param event The message event
   * @returns void
   * @see {@link BaseWidget.onMessageExtended}
   */
  private async onMessage(event: MessageEvent): Promise<void> {
    if (!this.iframe) return
    if (!this.config.allowedOrigins.includes(event.origin)) return
    if (event.source !== this.iframe.contentWindow) return
    if (typeof event.data !== 'object') return
    if (!event.data.type) return

    switch (event.data.type) {
      case MessageType.REQUEST_TOKEN:
        this.sendMessage({
          type: MessageType.SET_TOKEN,
          payload: await this.api.getToken(),
        } as SetTokenMessage)
        break

      case MessageType.OPEN_FULL_SCREEN:
        const data = event.data as OpenFullScreenMessage
        try {
          this.api.openFullScreen(data.payload)
        } catch (e) {
          console.error(
            '[OFCP] Widget',
            this.el,
            'failed to open full screen',
            e
          )
        }
        break

      case MessageType.CLOSE_FULL_SCREEN:
        this.api.closeFullScreen()
        break

      case MessageType.DESTROY_FULL_SCREEN:
        this.api.closeFullScreen(true)
        break

      case MessageType.STYLES_REQUEST_DATA:
        this.sendMessage({
          type: MessageType.STYLES_SEND_DATA,
          payload: this.config.styles,
        } as StylesSendDataMessage)

      case MessageType.PING:
        this.sendMessage({
          type: MessageType.PONG,
          payload: SDK_VERSION,
        } as PongMessage)
        break
      
      case MessageType.REQUEST_FULL_SCREEN_STATE:
        if (this.api.getAppWidget().isOpen()) {
          this.sendMessage({
            type: MessageType.FULL_SCREEN_OPENED,
          } as FullScreenOpenedMessage)
        } else {
          this.sendMessage({
            type: MessageType.FULL_SCREEN_CLOSED,
          } as FullScreenClosedMessage)
        }
        break
    }
  }

  /**
   * Lifecycle hooks for extending classes
   * @param event The message event
   * @returns Promise<boolean> Whether the message was handled
   * @see {@link BaseWidget.onMessage}
   */
  protected async onMessageExtended(event: MessageEvent): Promise<boolean> {
    return false
  }

  /**
   * Returns whether the widget is open or not
   * @returns True if the widget is open, false otherwise
   */
  public isOpen(): boolean {
    if (!this.iframe) return false
    return this.iframe.style.display != 'none';
  }

  /**
   * Shows the widget, creating it if necessary
   * @returns void
   * @see {@link BaseWidget.preShow} {@link BaseWidget.preCreate} {@link BaseWidget.postCreate} {@link BaseWidget.postShow}
   */
  public show(): void {
    this.preShow()
    if (this.iframe) {
      this.iframe.style.display = 'block'
      this.postShow()
      return
    }
    this.preCreate()
    this.iframe = document.createElement('iframe')
    this.iframe.src = `${this.config.widgetBaseURL}/${this.uiPath}`
    this.iframe.style.width = '100%'
    this.iframe.style.height = '100%'
    this.iframe.style.backgroundColor = 'transparent'
    this.iframe.style.border = 'none'
    // this.iframe.setAttribute('allow', 'camera') // Maybe needed for the editor
    this.iframe.setAttribute('allowtransparency', 'true')
    window.addEventListener('message', this.onMessage.bind(this))
    this.el.appendChild(this.iframe)
    this.postCreate()
    this.postShow()
  }

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected preShow(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected postShow(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected preCreate(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected postCreate(): void {}

  /**
   * Destroys the widget
   * @returns void
   * @see {@link BaseWidget.preDestroy} {@link BaseWidget.postDestroy}
   */
  public destroy(): void {
    if (!this.iframe) return
    this.preDestroy()
    window.removeEventListener('message', this.onMessage.bind(this))
    this.el.innerHTML = ''
    this.iframe = null
    this.postDestroy()
  }

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.destroy}
   */
  protected preDestroy(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.destroy}
   */
  protected postDestroy(): void {}

  /**
   * Hides the widget, without destroying it
   * @returns void
   */
  public hide(): void {
    if (!this.iframe) return
    this.preHide()
    this.iframe.style.display = 'none'
    this.postHide()
  }

  /**
   * Lifecycle hook for extending classes
   */
  protected preHide(): void {}

  /**
   * Lifecycle hook for extending classes
   */
  protected postHide(): void {}
}
