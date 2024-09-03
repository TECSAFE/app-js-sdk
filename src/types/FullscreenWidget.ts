import { BaseWidget } from "./BaseWidget";

/**
 * A widget that takes up the full screen
 */
export class FullscreenWidget extends BaseWidget {
  /**
   * @inheritdoc
   */
  protected preCreate(): void {
    if (!document.body.contains(this.el)) {
      this.el = document.createElement('div');
      document.body.appendChild(this.el);
    }
  }

  /**
   * @inheritdoc
   */
  protected postCreate(): void {
    if (!this.iframe) return;
    this.iframe.style.position = 'fixed';
    this.iframe.style.top = '0';
    this.iframe.style.left = '0';
    this.iframe.style.width = '100vw';
    this.iframe.style.height = '100vh';
    this.iframe.style.zIndex = '9999999999';
  }
}
