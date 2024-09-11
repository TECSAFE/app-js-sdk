import { BaseWidget } from '../types/BaseWidget'
import { writeUrlParams } from '../util/UrlParamRW'

/**
 * A widget that takes up the full screen, and is used to display different parts of the app.
 */
export class AppWidget extends BaseWidget {
  /**
   * The app widget allows any origin defined in the config, so it does not have a uiPath
   * @see {@link AppWidget.setUrl} {@link AppWidget.getUrl}
   */
  protected url: string

  /**
   * Sets the url of the widget
   * @param url The url of the widget
   * @throws If the url is not allowed by the config
   * @see {@link AppWidget.url} {@link AppWidget.getUrl}
   */
  public setUrl(url: string): void {
    const { origin } = new URL(url)
    if (!this.config.allowedOrigins.includes(origin)) {
      throw new Error(
        `[OFCP] Widget ${this.el} cannot set url to origin ${origin}`
      )
    }
    this.url = url
  }

  /**
   * Gets the url of the widget
   * @returns The url of the widget
   * @see {@link AppWidget.setUrl} {@link AppWidget.url}
   */
  public getUrl(): string {
    return this.url
  }

  /**
   * @inheritdoc
   */
  protected preCreate(): void {
    if (!document.body.contains(this.el)) {
      this.el = document.createElement('div')
      document.body.appendChild(this.el)
    }
  }

  /**
   * @inheritdoc
   */
  protected postCreate(): void {
    if (!this.iframe) return
    this.iframe.style.position = 'fixed'
    this.iframe.style.top = '0'
    this.iframe.style.left = '0'
    this.iframe.style.width = '100vw'
    this.iframe.style.height = '100vh'
    this.iframe.style.zIndex = '9999999999'
  }

  /**
   * If the iframe loads a new page, stores the url in the get parameters of the parent page.
   * This ensures if a user refreshes the page, they will be taken back to the same place.
   */
  protected handlePageLoad(): void {
    const url = this.iframe.contentWindow.location.href
    const { origin } = new URL(url)
    if (!this.config.allowedOrigins.includes(origin)) {
      this.destroy()
      console.error('[OFCP] Widget', this.el, 'cannot load url', url)
    }
    writeUrlParams({ browserId: this.api.getBrowserId(), url })
  }

  /**
   * @inheritdoc
   */
  protected postShow(): void {
    if (!this.url) {
      this.destroy()
      throw new Error(`[OFCP] Widget ${this.el} cannot show without a url`)
    }
    this.iframe.src = this.uiPath
  }

  /**
   * Not required for AppWidget, as it uses url instead of uiPath
   * @see {@link AppWidget.url}
   */
  protected readonly uiPath = ''
}
