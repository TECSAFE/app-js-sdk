import { TecsafeApi } from '../TecsafeApi'
import { OfcpConfig } from './Config'
import {
  Message,
  MessageType,
  OpenFullScreenMessage,
  SetTokenMessage,
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
   * The path to the iframe which will be appended to the uiOrigin (+ uiSuffix)
   */
  protected readonly uiPath: string = 'iframe'

  /**
   * Sends a message to the iframe
   * @param message The message to send
   * @returns void
   */
  public sendMessage(message: Message): void {
    if (!this.iframe) return
    this.iframe.contentWindow?.postMessage(message, this.config.uiOrigin)
  }

  /**
   * Handles messages from the iframe
   * @param event The message event
   * @returns void
   */
  private async onMessage(event: MessageEvent): Promise<void> {
    if (!this.iframe) return
    if (event.origin !== this.config.uiOrigin) return
    if (event.source !== this.iframe.contentWindow) return

    switch (event.data.type) {
      case MessageType.REQUEST_TOKEN:
        this.sendMessage({
          type: MessageType.SET_TOKEN,
          payload: await this.api.getToken(),
        } as SetTokenMessage)
        break

      case MessageType.OPEN_FULL_SCREEN:
        const data = event.data as OpenFullScreenMessage
        this.api.setFullScreenData(data.payload.data)
        const app = this.api.getAppWidget()
        app.setPathExtension(data.payload.path)
        app.show()
        break

      case MessageType.CLOSE_FULL_SCREEN:
        this.api.getAppWidget().hide()
        break

      default:
        if (!(await this.onMessageExtended(event))) {
          console.error(
            '[OFCP] Widget',
            this.el,
            'received unknown message',
            event.data
          )
        }
    }
  }

  /**
   * Lifecycle hooks for extending classes
   * @param event The message event
   * @returns Promise<boolean> Whether the message was handled
   */
  protected async onMessageExtended(event: MessageEvent): Promise<boolean> {
    return false
  }

  /**
   * Shows the widget, creating it if necessary
   * @returns void
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
    this.iframe.src = `${this.config.uiOrigin + this.config.uiSuffix}/${this.uiPath}`
    this.iframe.style.width = '100%'
    this.iframe.style.height = '100%'
    this.iframe.style.backgroundColor = 'transparent'
    this.iframe.style.border = 'none'
    window.addEventListener('message', this.onMessage.bind(this))
    this.el.appendChild(this.iframe)
    this.postCreate()
    this.postShow()
  }

  /**
   * Lifecycle hook for extending classes
   */
  protected preShow(): void {}

  /**
   * Lifecycle hook for extending classes
   */
  protected postShow(): void {}

  /**
   * Lifecycle hook for extending classes
   */
  protected preCreate(): void {}

  /**
   * Lifecycle hook for extending classes
   */
  protected postCreate(): void {}

  /**
   * Destroys the widget
   * @returns void
   */
  public destroy(): void {
    if (!this.iframe) return
    this.preDestroy()
    this.el.innerHTML = ''
    this.iframe = null
    this.postDestroy()
  }

  /**
   * Lifecycle hook for extending classes
   */
  protected preDestroy(): void {}

  /**
   * Lifecycle hook for extending classes
   */
  protected postDestroy(): void {}

  /**
   * Hides the widget
   * @returns void
   */
  public hide(): void {
    if (!this.iframe) return
    this.iframe.style.display = 'none'
  }
}
