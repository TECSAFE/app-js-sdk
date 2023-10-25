import TecsafeApi, { ListenerRemover } from "./TecsafeApi";
import { ClientToServerMessage } from "./IframeMessage";
import { CustomerToken } from "./CommonTypes";

export default abstract class StandaloneWidget {
  protected api: TecsafeApi;
  protected element: HTMLElement | null = null;
  protected iframe: HTMLIFrameElement | null = null;

  protected unregister: ListenerRemover[] = [];

  constructor(api: TecsafeApi) {
    this.api = api;

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
        this.destroy();
      }),
    );

    const customerToken = this.api.getCustomerToken();

    if (customerToken) {
      this.build(customerToken);
    } else {
      this.destroy();
    }
  }

  destroy() {
    for (const unregister of this.unregister) {
      unregister();
    }

    this.iframe = null;
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  protected build(customerToken: CustomerToken): void {}

  protected message(message: ClientToServerMessage) {
    this.iframe?.contentWindow?.postMessage(message);
  }
}
