import TecsafeApi, { ListenerRemover } from "./TecsafeApi";
import { SdkToAppMessage } from "./IframeMessage";
import { CustomerToken } from "./CommonTypes";

export default abstract class EmbeddedWidget {
  protected api: TecsafeApi;
  protected element: HTMLElement;
  protected iframe: HTMLIFrameElement | null = null;

  protected unregister: ListenerRemover[] = [];

  constructor(api: TecsafeApi, element: HTMLElement) {
    this.api = api;
    this.element = element;

    this.unregister.push(
      this.api.on("customerChanged", (customerToken) => {
        this.build(customerToken);
      }),
    );

    this.unregister.push(
      this.api.on("refreshToken", (customerToken) => {
        this.message({
          type: "refreshCustomerToken",
          customerToken,
        });
      }),
    );

    this.unregister.push(
      this.api.on("customerLogout", () => {
        this.handleLogout();
      }),
    );

    const customerToken = this.api.getCustomerToken();

    if (customerToken) {
      this.build(customerToken);
    } else {
      this.handleLogout();
    }
  }

  protected handleLogout() {
    this.iframe = null;
    this.element.innerHTML = "No Customer Token";
  }

  destroy() {
    for (const unregister of this.unregister) {
      unregister();
    }

    this.iframe = null;
    this.element.innerHTML = "";
  }

  protected build(customerToken: CustomerToken): void {}

  private message(message: SdkToAppMessage) {
    this.iframe?.contentWindow?.postMessage(message);
  }
}
