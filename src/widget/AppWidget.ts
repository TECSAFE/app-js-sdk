import { BaseWidget } from "../types/BaseWidget";
import { FullScreenSendDataMessage, MessageType } from "../types/Messages";

/**
 * A widget that takes up the full screen, and is used to display different parts of the app.
 */
export class AppWidget extends BaseWidget {
  private pathExtension: string;

  /**
   * Sets the path extension
   */
  public setPathExtension(pathExtension: string): void {
    this.pathExtension = pathExtension;
  }

  /**
   * Gets the path extension
   */
  public getPathExtension(): string {
    return this.pathExtension;
  }

    /**
   * @inheritdoc
   */
  protected preCreate(): void {
    if (!document.body.contains(this.el)) {
      this.el = document.createElement("div");
      document.body.appendChild(this.el);
    }
  }

  /**
   * @inheritdoc
   */
  protected postCreate(): void {
    if (!this.iframe) return;
    this.iframe.style.position = "fixed";
    this.iframe.style.top = "0";
    this.iframe.style.left = "0";
    this.iframe.style.width = "100vw";
    this.iframe.style.height = "100vh";
    this.iframe.style.zIndex = "9999999999";
  }

  /**
   * @inheritdoc
   */
  protected postShow(): void {
    this.iframe.src = `${this.config.uiOrigin + this.config.uiSuffix}/${this.uiPath}/${this.pathExtension}`;
  }

  /**
   * @inheritdoc
   */
  protected async onMessageExtended(event: MessageEvent): Promise<boolean> {
    if (event.data.type !== MessageType.FULL_SCREEN_REQUEST_DATA) return false;
    this.sendMessage({
      type: MessageType.FULL_SCREEN_SEND_DATA,
      payload: this.api.getFullScreenData(),
    } as FullScreenSendDataMessage);
    return true;
  }

  /**
   * @inheritdoc
   */
  protected readonly uiPath = "app";
}
