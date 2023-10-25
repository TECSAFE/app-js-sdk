import TecsafeApi, { ListenerRemover } from "./TecsafeApi";
import { ClientToServerMessage } from "./IframeMessage";
import { CustomerToken } from "./CommonTypes";

export default class AppWidget {
  private api: TecsafeApi;
  private customerToken: CustomerToken | null = null;
  private element: HTMLElement | null = null;
  private iframe: HTMLIFrameElement | null = null;

  private customerTokenChangedListenerRemover: ListenerRemover;

  constructor(api: TecsafeApi) {
    this.api = api;

    this.customerTokenChangedListenerRemover = this.api.on(
      "customerTokenChanged",
      (customerToken) => {
        this.updateCustomerToken(customerToken);
      },
    );

    this.updateCustomerToken(this.api.getCustomerToken());
  }

  destroy() {
    this.customerTokenChangedListenerRemover();
    this.iframe = null;
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  updateCustomerToken(customerToken: CustomerToken | null) {
    if (this.customerToken === customerToken) {
      return;
    }

    this.customerToken = customerToken;

    if (this.customerToken) {
      this.buildIframe();
    } else {
      this.destroy();
    }
  }

  private buildIframe(): void {
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
    this.iframe.src = `${this.api.APP_URL}/iframe/app?customerToken=${this.customerToken}`;
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
