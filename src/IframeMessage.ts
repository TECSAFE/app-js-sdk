import {CustomerToken, ItemId} from "./TecsafeApi";

export type ServerToClientMessage = AddToCartMessage|RemoveFromCartMessage|ChangeCartQuantityMessage;

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
};

export type ClientToServerMessage = ChangeCustomerToken;

type ChangeCustomerToken = {
    type: 'changeCustomerToken';
    customerToken: CustomerToken;
}