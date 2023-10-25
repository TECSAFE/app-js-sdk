import TecsafeApi, { ListenerRemover } from "./TecsafeApi";
import { ClientToServerMessage } from "./IframeMessage";
import { CustomerToken } from "./CommonTypes";

export default class CartWidget {
  private api: TecsafeApi;
  private customerToken: CustomerToken | null = null;
  private element: HTMLElement;
  private iframe: HTMLIFrameElement | null = null;

  private customerTokenChangedListenerRemover: ListenerRemover;

  constructor(api: TecsafeApi, element: HTMLElement) {
    this.api = api;
    this.element = element;

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
    this.element.innerHTML = "";
  }

  updateCustomerToken(customerToken: CustomerToken | null) {
    if (this.customerToken === customerToken) {
      return;
    }

    if (this.customerToken === null && customerToken !== null) {
      this.customerToken = customerToken;
      this.buildIframe();
    } else if (this.customerToken !== null && customerToken === null) {
      this.customerToken = null;
      this.buildBanner();
    }

    if (customerToken) {
      this.message({
        type: "changeCustomerToken",
        customerToken: customerToken,
      });
    }
  }

  private buildIframe(): void {
    this.element.innerHTML = ""; // remove all children
    this.iframe = document.createElement("iframe");
    this.iframe.src = `${this.api.APP_URL}/iframe/cart`;
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.style.border = "none";

    this.element.appendChild(this.iframe);
  }

  private buildBanner(): void {
    this.element.innerHTML = ""; // remove all children
    this.iframe = null;
    const button = document.createElement("button");

    button.innerText = "Activate";
    button.onclick = () => {
      this.api.emit("bannerClicked");
    };

    this.element.appendChild(button);
  }

  private message(message: ClientToServerMessage) {
    this.iframe?.contentWindow?.postMessage(message);
  }
}
