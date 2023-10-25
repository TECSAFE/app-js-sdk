import { ItemId, Price } from "./CommonTypes";

export type ServerToClientMessage =
  | AddToCartMessage
  | RemoveFromCartMessage
  | ChangeCartQuantityMessage
  | OpenAppMessage
  | CloseAppMessage;

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

type OpenAppMessage = {
  type: "openApp";
};

type CloseAppMessage = {
  type: "closeApp";
};

export type ClientToServerMessage = {};
