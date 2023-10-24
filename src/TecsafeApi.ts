import HttpClient from "./HttpClient";
import {TypedEmitter} from "tiny-typed-emitter";
import ProductDetailWidget from "./ProductDetailWidget";
import CartWidget from "./CartWidget";
import {GetCustomerTokenCallback} from "./index";

export type EAN = "string";
export type ItemId = "string";
export type ContainerId = "string";
export type CustomerToken = "string";

export default class TecsafeApi {
    private httpClient: HttpClient;
    private sessionStorageKey: string = 'tecsafe-customer-token';
    private getCustomerTokenCallback: GetCustomerTokenCallback;
    private customerToken: CustomerToken | null = null;
    private eventEmitter: TypedEmitter<Listener> = new TypedEmitter<Listener>();

    public readonly APP_URL = 'https://tecsafe.github.io/app-ui';

    constructor(getCustomerTokenCallback: GetCustomerTokenCallback) {
        this.getCustomerTokenCallback = getCustomerTokenCallback;
        this.httpClient = new HttpClient(() => this.getCustomerToken());

        window.addEventListener('message', (event: MessageEvent<Message>) => {
            this.listenMessage(event.data);
        });
    }

    async initialize() {
        this.customerToken = sessionStorage.getItem(this.sessionStorageKey) as CustomerToken | null;

        if (!this.customerToken) {
            this.customerToken = await this.getCustomerTokenCallback();
            sessionStorage.setItem(this.sessionStorageKey, this.customerToken);
        }

        this.eventEmitter.emit('customerTokenChanged', this.customerToken);
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

    async reloadToken() {
        this.customerToken = await this.getCustomerTokenCallback();
        sessionStorage.setItem("tecsafe-customer-token", this.customerToken);
        this.eventEmitter.emit('customerTokenChanged', this.customerToken);
    }

    logout() {
        this.customerToken = null;
        sessionStorage.removeItem("tecsafe-customer-token");
        this.eventEmitter.emit('customerTokenChanged', null);
    }

    getCustomerToken(): CustomerToken {
        const customerToken = this.customerToken;

        if (!customerToken) {
            throw new Error('missing customer token');
        }

        return customerToken;
    }

    async getCart(): Promise<Cart> {
        return this.httpClient.get<Cart>('/cart');
    }

    on<U extends keyof Listener>(event: U, listener: Listener[U]): ListenerRemover {
        this.eventEmitter.on(event, listener);

        return () => {
            this.eventEmitter.off(event, listener);
        }
    }

    off<U extends keyof Listener>(event: U, listener: Listener[U]): void {
        this.eventEmitter.off(event, listener);
    }

    emit<U extends keyof Listener>(event: U, ...args: Parameters<Listener[U]>): void {
        this.eventEmitter.emit(event, ...args);
    }

    private listenMessage(message: Message) {
        switch (message.type) {
            case "addToCart":
                this.eventEmitter.emit('addToCart', message.itemId, message.quantity, message.price);
                break;
            case "removeFromCart":
                this.eventEmitter.emit('removeFromCart', message.itemId);
                break;
            case "changeCartQuantity":
                this.eventEmitter.emit('changeCartQuantity', message.itemId, message.quantity, message.price);
                break;
        }
    }
}

export interface Listener {
    customerTokenChanged: (customerToken: CustomerToken|null) => void;
    bannerClicked: () => void;
    addToCart: (itemId: ItemId, quantity: number, price: number) => void;
    removeFromCart: (itemId: ItemId) => void;
    changeCartQuantity: (itemId: ItemId, quantity: number, price: number) => void;
}

export interface ListenerRemover {
    (): void;
}

export interface Cart {
    articles: CartItem[];
    sum: number;
}

export interface CartItem {
    id: ItemId;
    quantity: number;
    price: number;
}

// Messages

type Message = AddToCartMessage|RemoveFromCartMessage|ChangeCartQuantityMessage;

type AddToCartMessage = {
    type: 'addToCart';
    itemId: ItemId;
    quantity: number;
    price: number;
}

type RemoveFromCartMessage = {
    type: 'removeFromCart';
    itemId: ItemId;
}

type ChangeCartQuantityMessage = {
    type: 'changeCartQuantity';
    itemId: ItemId;
    quantity: number;
    price: number;
}