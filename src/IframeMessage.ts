import { CustomerToken, ItemId, Price } from "./CommonTypes";

export type ServerToClientMessage =
  | AddToCartMessage
  | RemoveFromCartMessage
  | ChangeCartQuantityMessage;

type AddToCartMessage = {
  type: "addToCart";
  itemId: ItemId;
  quantity: number;
  price: Price;
};

type RemoveFromCartMessage = {
  type: "removeFromCart";
  itemId: ItemId;
};

type ChangeCartQuantityMessage = {
  type: "changeCartQuantity";
  itemId: ItemId;
  quantity: number;
  price: Price;
};

export type ClientToServerMessage = ChangeCustomerToken;

type ChangeCustomerToken = {
  type: "changeCustomerToken";
  customerToken: CustomerToken;
};
