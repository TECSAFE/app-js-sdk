import TecsafeApi from "./TecsafeApi";
import { ContainerId, CustomerToken, EAN } from "./CommonTypes";

export default class ProductDetailWidget {
  private api: TecsafeApi;
  private customerToken: CustomerToken | null = null;
  private element: HTMLElement;
  private iframe: HTMLIFrameElement | null = null;
  private insertArticles: EAN[];
  private containerId: ContainerId;

  constructor(
    api: TecsafeApi,
    element: HTMLElement,
    insertArticles: EAN[],
    containerId: ContainerId,
  ) {
    this.api = api;
    this.element = element;
    this.insertArticles = insertArticles;
    this.containerId = containerId;

    this.api.on("customerTokenChanged", this.updateCustomerToken);

    this.updateCustomerToken(this.api.getCustomerToken());
  }

  destroy() {
    this.api.off("customerTokenChanged", this.updateCustomerToken);
    this.iframe = null;
    this.element.innerHTML = "destroyed!";
  }

  updateCustomerToken(customerToken: CustomerToken | null) {
    this.customerToken = customerToken;

    if (customerToken) {
      this.buildIframe();
    } else {
      this.buildBanner();
    }
  }

  private buildIframe() {
    this.element.innerHTML = ""; // remove all children
    this.iframe = document.createElement("iframe");
    this.iframe.src = `${this.api.APP_URL}/iframe/widget?customerToken=${this.customerToken}`;
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.style.border = "none";

    this.element.appendChild(this.iframe);
  }

  private buildBanner() {
    this.element.innerHTML = ""; // remove all children
    this.iframe = null;
    const button = document.createElement("button");

    button.innerText = "Activate";
    button.onclick = () => {};

    this.element.appendChild(button);
  }
}
