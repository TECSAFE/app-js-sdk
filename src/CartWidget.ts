import { CustomerToken } from "./CommonTypes";
import EmbeddedWidget from "./EmbeddedWidget";

export default class CartWidget extends EmbeddedWidget {
  protected build(customerToken: CustomerToken): void {
    this.element.innerHTML = ""; // remove all children
    this.iframe = document.createElement("iframe");
    this.iframe.src = `${this.api.APP_URL}/iframe/cart?customerToken=${customerToken}`;
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.style.border = "none";

    this.element.appendChild(this.iframe);
  }
}
