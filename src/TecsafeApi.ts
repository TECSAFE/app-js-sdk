import { BaseWidget } from './types/BaseWidget'
import { OfcpConfig } from './types/Config'
import {
  FullScreenClosedMessage,
  FullScreenOpenedMessage,
  Message,
  MessageType,
  SetTokenMessage,
} from './types/messages'
import { AppWidget } from './widget/AppWidget'
import { parseCustomerJwt } from '@tecsafe/jwt-sdk'
import { CartWidget } from './widget/CartWidget'
import { ProductDetailWidget } from './widget/ProductDetailWidget'
import { readUrlParams, clearUrlParams } from './util/UrlParamRW'
import { EventType } from './types/EventType'

/**
 * The main entry point for the OFCP App JS SDK
 */
export class TecsafeApi {
  /**
   * The main entry point for the OFCP App JS SDK.
   * This class should only be instantiated after the user has consented to the terms, conditions, and privacy policy!
   * @param tokenFN A function that returns the customer token as a string inside a promise
   * @param config Advanced configuration for the SDK, rarely needed
   * @throws An error if the configuration is invalid
   */
  constructor(
    private readonly tokenFN: () => Promise<string>,
    private readonly config: OfcpConfig = new OfcpConfig()
  ) {
    const url = new URL(config.widgetBaseURL)
    if (!config.allowedOrigins.includes(url.origin)) {
      throw new Error('The widgetBaseURL must be in the allowedOrigins list')
    }
    this.appWidget = new AppWidget(config, document.createElement('div'), this)
    // To don't make it to obvious thats a "browserID"
    // We shorten it to "bid"
    this.browserId = localStorage.getItem('ofcp-bid')
    if (!this.browserId) {
      this.browserId = Math.random().toString(36).slice(2)
      localStorage.setItem('ofcp-bid', this.browserId)
    }
    const params = readUrlParams()
    if (!params.browserId) return
    if (this.browserId !== params.browserId) {
      clearUrlParams()
      console.warn('[OFCP] Browser ID mismatch, clearing URL params')
      return
    }
    try {
      this.openFullScreen(params.url)
    } catch (e) {
      console.error('[OFCP] Failed to open full screen:', e)
    }
  }

  private browserId: string
  private widgets: BaseWidget[] = []
  private appWidget: AppWidget
  private token: string
  private tokenTimeout: number
  private tokenPromise: Promise<string> | null = null
  private refreshTimeoutId: number | null = null
  private fullScreenData: any
  private eventListeners: { [key: string]: ((...args: any[]) => void)[] } = {}

  /**
   * Adds an event listener to the SDK
   * @param event The event to listen for, see {@link EventType}
   * @param listener The listener to call when the event is triggered.
   */
  public addEventListener(
    event: EventType,
    listener: (...args: any[]) => void
  ): void {
    if (!this.eventListeners[event]) this.eventListeners[event] = []
    this.eventListeners[event].push(listener)
  }

  /**
   * Removes an event listener from the SDK
   * @param event The event to remove the listener from
   * @param listener The listener to remove
   */
  public removeEventListener(
    event: EventType,
    listener: (...args: any[]) => void
  ): void {
    if (!this.eventListeners[event]) return
    const index = this.eventListeners[event].indexOf(listener)
    if (index !== -1) this.eventListeners[event].splice(index, 1)
    if (this.eventListeners[event].length === 0)
      delete this.eventListeners[event]
  }

  /**
   * Gets all event listeners
   * @returns An object with the event names as keys, and the listeners as values
   */
  public getEventListeners(): { [key: string]: ((...args: any[]) => void)[] } {
    return this.eventListeners
  }

  /**
   * Get the browser ID, a random string that is stored in localStorage.
   * This is NOT used for tracking, but to identify the browser if the user mistakenly shares the URL with OFCP data in it.
   * @see {@link clearUrlParams}
   */
  public getBrowserId(): string {
    return this.browserId
  }

  /**
   * Opens the AppWidget in full screen mode on the provided url
   * @param url The url to open in full screen
   * @throws An error if the url is not in the allowedOrigins list
   * @see {@link AppWidget}
   */
  public openFullScreen(url: string): void {
    this.appWidget.setUrl(url)
    this.sendToAllWidgets({
      type: MessageType.FULL_SCREEN_OPENED,
      payload: null,
    } as FullScreenOpenedMessage)
  }

  /**
   * Closes the AppWidget full screen mode
   * @param destroy If true, the widget will be destroyed instead of hidden
   * @see {@link AppWidget}
   */
  public closeFullScreen(destroy = false): void {
    if (!destroy) this.appWidget.hide()
    else this.appWidget.destroy()
    this.sendToAllWidgets({
      type: MessageType.FULL_SCREEN_CLOSED,
      payload: null,
    } as FullScreenClosedMessage)
  }

  /**
   * Sends a message to all widgets
   * @param message The message to send
   */
  public sendToAllWidgets(message: Message): void {
    for (const widget of this.widgets) widget.sendMessage(message)
    this.appWidget.sendMessage(message)
  }

  /**
   * The common method to save the token, and set the timeout for refreshing the token.
   * @param token The token to save
   * @returns A promise that resolves to the token again so the function can be chained
   */
  private async saveToken(token: string): Promise<string> {
    if (this.refreshTimeoutId) clearTimeout(this.refreshTimeoutId)
    this.token = token
    const body = await parseCustomerJwt(this.token)
    if (!body)
      console.error(
        '[OFCP] Failed to parse token, is the tokenFN correctly implemented?'
      )
    const in60s = Date.now() + 60_000
    this.tokenTimeout = body
      ? Math.max(body.exp * 1_000 - 60_000, in60s)
      : in60s
    this.refreshTimeoutId = setTimeout(
      () => this.refreshToken(),
      this.tokenTimeout - Date.now()
    )
    return token
  }

  /**
   * Gets the token, refreshing it if necessary.
   * Utilizes a cache to prevent multiple requests, and only refreshes the token if it is expired (or refresh is true).
   * @returns The token as a string inside a promise
   */
  public async getToken(refresh = false): Promise<string> {
    if (!refresh && this.tokenTimeout > Date.now()) return this.token
    if (this.tokenPromise) return this.tokenPromise
    this.tokenPromise = this.tokenFN()
    const token = await this.saveToken(await this.tokenPromise)
    this.tokenPromise = null
    return token
  }

  /**
   * Refreshes the token and sends it to all widgets
   * @param token If provided, the token to use instead of fetching a new one with the tokenFN
   */
  public async refreshToken(token?: string | null): Promise<void> {
    if (token) await this.saveToken(token)
    else token = await this.getToken(true)
    this.sendToAllWidgets({
      type: MessageType.SET_TOKEN,
      payload: token,
    } as SetTokenMessage)
  }

  /**
   * Destroys all widgets, and resets the SDK to its initial state
   */
  public async destroyAll(): Promise<void> {
    if (this.refreshTimeoutId) clearTimeout(this.refreshTimeoutId)
    this.refreshTimeoutId = null
    this.appWidget.destroy()
    for (const widget of this.widgets) widget.destroy()
    this.widgets = []
  }

  /**
   * Internal method to add a widget to the list of widgets, and show it
   * @param widget The widget to add
   * @returns The widget
   */
  private createWidget(widget: BaseWidget): BaseWidget {
    this.widgets.push(widget)
    widget.show()
    return widget
  }

  /**
   * Creates a cart widget
   * @param el The element to attach the widget to
   * @returns The cart widget
   */
  public createCartWidget(el: HTMLElement): CartWidget {
    return this.createWidget(
      new CartWidget(this.config, el, this)
    ) as CartWidget
  }

  /**
   * Creates a product detail widget
   * @param el The element to attach the widget to
   * @returns The product detail widget
   */
  public createProductDetailWidget(el: HTMLElement): ProductDetailWidget {
    return this.createWidget(
      new ProductDetailWidget(this.config, el, this)
    ) as ProductDetailWidget
  }

  /**
   * Gets the app widget
   * @returns The app widget
   */
  public getAppWidget(): AppWidget {
    return this.appWidget
  }

  /**
   * Gets the config
   * @returns The config
   */
  public getConfig(): OfcpConfig {
    return this.config
  }

  /**
   * Gets the widgets
   * @returns The widgets
   */
  public getWidgets(): BaseWidget[] {
    return this.widgets
  }

  /**
   * Gets the timestamp (in milliseconds) when the token will expire
   * @returns The timestamp when the token will expire
   */
  public getTokenTimeout(): number {
    return this.tokenTimeout
  }

  /**
   * Sets the full screen data. It is not recommended to use this method directly.
   * @param data The full screen data
   */
  public setFullScreenData(data: any): void {
    this.fullScreenData = data
  }

  /**
   * Gets the full screen data. It is not recommended to use this method directly.
   * @returns The full screen data
   */
  public getFullScreenData(): any {
    return this.fullScreenData
  }
}
