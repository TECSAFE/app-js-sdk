import TecsafeApi from "./TecsafeApi";
import { ContainerId, CustomerToken, EAN } from "./CommonTypes";
import EmbeddedWidget from "./EmbeddedWidget";

export default class ProductDetailWidget extends EmbeddedWidget {
  private containerId: ContainerId;
  private insertArticles: EAN[];

  constructor(
    api: TecsafeApi,
    element: HTMLElement,
    containerId: ContainerId,
    insertArticles: EAN[] = [],
  ) {
    super(api, element);

    this.containerId = containerId;
    this.insertArticles = insertArticles;
  }

  protected build(customerToken: CustomerToken) {
    this.element.innerHTML = ""; // remove all children
    this.iframe = document.createElement("iframe");
    this.iframe.src = `${this.api.config.appUrl}/iframe/widget?customerToken=${customerToken}`;
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.style.border = "none";

    this.element.appendChild(this.iframe);
  }
}
