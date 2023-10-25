import TecsafeApi from "./TecsafeApi";
import { ContainerId, CustomerToken, EAN } from "./CommonTypes";
import EmbeddedWidget from "./EmbeddedWidget";

export default class ProductDetailWidget extends EmbeddedWidget {
  private insertArticles: EAN[];
  private containerId: ContainerId;

  constructor(
    api: TecsafeApi,
    element: HTMLElement,
    insertArticles: EAN[],
    containerId: ContainerId,
  ) {
    super(api, element);

    this.insertArticles = insertArticles;
    this.containerId = containerId;
  }

  protected build(customerToken: CustomerToken) {
    this.element.innerHTML = ""; // remove all children
    this.iframe = document.createElement("iframe");
    this.iframe.src = `${this.api.APP_URL}/iframe/widget?customerToken=${customerToken}`;
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.style.border = "none";

    this.element.appendChild(this.iframe);
  }
}
