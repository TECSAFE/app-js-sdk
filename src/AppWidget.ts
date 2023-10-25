import TecsafeApi, { ListenerRemover } from "./TecsafeApi";
import { ClientToServerMessage } from "./IframeMessage";
import { CustomerToken } from "./CommonTypes";

export default class AppWidget {
  private api: TecsafeApi;
  private element: HTMLElement | null = null;
  private iframe: HTMLIFrameElement | null = null;

  private customerTokenChangedListenerRemover: ListenerRemover;

  constructor(api: TecsafeApi) {
    this.api = api;

    this.customerTokenChangedListenerRemover = this.api.on(
      "customerTokenChanged",
      (customerToken) => {
        this.update();
      },
    );

    this.update();
  }

  destroy() {
    this.customerTokenChangedListenerRemover();
    this.iframe = null;
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  update() {
    const customerToken = this.api.getCustomerToken();

    if (customerToken) {
      this.buildIframe(customerToken);
    } else {
      this.destroy();
    }
  }

  private buildIframe(customerToken: CustomerToken): void {
    this.element = document.createElement("div");
    this.element.style.position = "fixed";
    this.element.style.backdropFilter = "blur(10px)";
    this.element.style.top = "0";
    this.element.style.left = "0";
    this.element.style.height = "100%";
    this.element.style.width = "100%";
    this.element.style.padding = "2rem";
    this.element.style.boxSizing = "border-box";

    this.iframe = document.createElement("iframe");
    this.iframe.src = `${
      this.api.APP_URL
    }/iframe/app?customerToken=${this.api.getCustomerToken()}`;
    this.iframe.style.height = "100%";
    this.iframe.style.width = "100%";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.style.border = "none";

    this.element.appendChild(this.iframe);
    document.body.append(this.element);
  }

  private message(message: ClientToServerMessage) {
    this.iframe?.contentWindow?.postMessage(message);
  }
}
