import { CustomerToken } from "./CommonTypes";
import StandaloneWidget from "./StandaloneWidget";

export default class AppWidget extends StandaloneWidget {
  protected build(customerToken: CustomerToken): void {
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
}
