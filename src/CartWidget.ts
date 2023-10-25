import TecsafeApi, { ListenerRemover } from "./TecsafeApi";
import { ClientToServerMessage } from "./IframeMessage";
import { CustomerToken } from "./CommonTypes";

export default class CartWidget {
  private api: TecsafeApi;
  private element: HTMLElement;
  private iframe: HTMLIFrameElement | null = null;

  private customerTokenChangedListenerRemover: ListenerRemover;

  constructor(api: TecsafeApi, element: HTMLElement) {
    this.api = api;
    this.element = element;

    this.customerTokenChangedListenerRemover = this.api.on(
      "customerTokenChanged",
      () => {
        this.update();
      },
    );

    this.update();
  }

  destroy() {
    this.customerTokenChangedListenerRemover();
    this.iframe = null;
    this.element.innerHTML = "";
  }

  update() {
    const customerToken = this.api.getCustomerToken();

    if (customerToken) {
      this.buildIframe(customerToken);
    } else {
      this.buildBanner();
    }
  }

  private buildIframe(customerToken: CustomerToken): void {
    this.element.innerHTML = ""; // remove all children
    this.iframe = document.createElement("iframe");
    this.iframe.src = `${this.api.APP_URL}/iframe/cart?customerToken=${customerToken}`;
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.style.border = "none";

    this.element.appendChild(this.iframe);
  }

  private buildBanner(): void {
    this.element.innerHTML = "Invalid Token";
  }

  private message(message: ClientToServerMessage) {
    this.iframe?.contentWindow?.postMessage(message);
  }
}
