import HttpClient from "./HttpClient";
import { TypedEmitter } from "tiny-typed-emitter";
import ProductDetailWidget from "./ProductDetailWidget";
import CartWidget from "./CartWidget";
import AppWidget from "./AppWidget";
import { GetCustomerTokenCallback } from "./index";
import { AppToSdkMessage } from "./IframeMessage";
import { ContainerId, CustomerToken, EAN, ItemId, Price } from "./CommonTypes";
import jwt_decode from "jwt-decode";

export default class TecsafeApi {
  public readonly config: Config;
  private httpClient: HttpClient;
  private getCustomerTokenCallback: GetCustomerTokenCallback;
  private customerToken: CustomerToken | null = null;
  private eventEmitter: TypedEmitter<Listener> = new TypedEmitter<Listener>();
  private appWidget: AppWidget | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;
  private retryCounter: number = 0;

  constructor(
    getCustomerTokenCallback: GetCustomerTokenCallback,
    config: Config,
  ) {
    this.config = {
      appUrl: "https://tecsafe.github.io/app-ui/",
      ...config,
    };

    this.getCustomerTokenCallback = getCustomerTokenCallback;
    this.httpClient = new HttpClient(() => {
      if (this.customerToken === null) {
        throw new Error("missing customer token");
      }

      return this.customerToken;
    });

    window.addEventListener(
      "message",
      (event: MessageEvent<AppToSdkMessage>) => {
        this.listenMessage(event.data);
      },
    );
  }

  async initialize() {
    await this.reloadToken();
  }

  productDetailWidget(
    element: HTMLElement,
    insertArticles: EAN[],
    containerId: ContainerId,
  ): ProductDetailWidget {
    return new ProductDetailWidget(this, element, insertArticles, containerId);
  }

  cartWidget(element: HTMLElement): CartWidget {
    return new CartWidget(this, element);
  }

  openApp(): AppWidget {
    if (this.appWidget) {
      return this.appWidget;
    }

    this.appWidget = new AppWidget(this);

    return this.appWidget;
  }

  closeApp(): void {
    if (!this.appWidget) {
      return;
    }

    this.appWidget.destroy();
    this.appWidget = null;
  }

  async reloadToken(): Promise<void> {
    try {
      const token = await this.getCustomerTokenCallback();

      if (token === this.customerToken) {
        return;
      }

      if (token === null) {
        this.logout();

        return;
      }

      const decodedToken = jwt_decode<DecodedToken>(token);

      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
        this.refreshTimeout = null;
      }

      // check expire date

      this.refreshTimeout = setTimeout(
        () => {
          this.reloadToken();
        },
        (decodedToken.exp - 30) * 1000 - Date.now(),
      );

      if (this.customerToken) {
        const previousDecodedToken = jwt_decode<DecodedToken>(
          this.customerToken,
        );

        if (previousDecodedToken.sub === decodedToken.sub) {
          this.customerToken = token;
          this.retryCounter = 0;
          this.eventEmitter.emit("refreshToken", token);

          return;
        }
      }

      this.customerToken = token;
      this.retryCounter = 0;
      this.eventEmitter.emit("customerChanged", token);
    } catch (e) {
      console.error(e);

      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
        this.refreshTimeout = null;
      }

      if (this.retryCounter < 3) {
        console.warn(`retry in 5 seconds (${this.retryCounter + 1}/3)`);
        this.retryCounter++;
        this.refreshTimeout = setTimeout(() => {
          this.reloadToken();
        }, 5000);

        return;
      }

      this.logout();
    }
  }

  logout() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }

    this.customerToken = null;
    this.eventEmitter.emit("customerLogout");
  }

  getCustomerToken(): CustomerToken | null {
    return this.customerToken;
  }

  async getCart(): Promise<Cart> {
    return this.httpClient.get<Cart>("/cart");
  }

  on<U extends keyof Listener>(
    event: U,
    listener: Listener[U],
  ): ListenerRemover {
    this.eventEmitter.on(event, listener);

    return () => {
      this.eventEmitter.off(event, listener);
    };
  }

  off<U extends keyof Listener>(event: U, listener: Listener[U]): void {
    this.eventEmitter.off(event, listener);
  }

  emit<U extends keyof Listener>(
    event: U,
    ...args: Parameters<Listener[U]>
  ): void {
    this.eventEmitter.emit(event, ...args);
  }

  private listenMessage(message: AppToSdkMessage) {
    switch (message.type) {
      case "addToCart":
        this.eventEmitter.emit(
          "addToCart",
          message.itemId,
          message.quantity,
          message.price,
        );
        break;
      case "removeFromCart":
        this.eventEmitter.emit("removeFromCart", message.itemId);
        break;
      case "changeCartQuantity":
        this.eventEmitter.emit(
          "changeCartQuantity",
          message.itemId,
          message.quantity,
          message.price,
        );
        break;
      case "openApp":
        this.openApp();
        break;
      case "closeApp":
        this.closeApp();
        break;
    }
  }
}

export interface Listener {
  customerChanged: (customerToken: CustomerToken) => void;
  customerLogout: () => void;
  refreshToken: (customerToken: CustomerToken) => void;
  bannerClicked: () => void;
  addToCart: (itemId: ItemId, quantity: number, price: Price) => void;
  removeFromCart: (itemId: ItemId) => void;
  changeCartQuantity: (itemId: ItemId, quantity: number, price: Price) => void;
}

export interface ListenerRemover {
  (): void;
}

export interface Cart {
  articles: CartItem[];
  sum: Price;
}

export interface CartItem {
  id: ItemId;
  quantity: number;
  price: Price;
}

type DecodedToken = {
  sub: string;
  exp: number;
};

export type Config = {
  readonly appUrl?: string;
};
