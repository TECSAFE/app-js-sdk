# App-JS-SDK

The TECSAFE App-JS-SDK provides a convenience wrapper to interact with the TECSAFE App.

## API Usage

### Initialize the SDK

```js
const api = await TecsafeSdk.initializeTecsafeApi(async () => {
  const response = await fetch("https://mybackend.com/tecsafe/token");
  const json = await response.json();

  return json.token;
});
```

#### Return Values

JWT Token as `string`: If the an user is logged in or an anonymous token is available. The Widget are enabled.

`null`: If the user is not logged in and an anonymous token is not available. The Widget are disabled.

`Error`: If the token could not be loaded. The Widget are disabled. Try to reload the token 5 seconds later and 3 times.

### Reload Token

```js
api.reloadToken();
```

### Logout

```js
api.logout();
```

## Product Detail Usage

### Create a product detail widget

```js
const widgetWrapper = document.getElementById("product-detail-widget");
const productWidget = api.productDetailWidget(widgetWrapper, []);
```

### destroy product detail widget

```js
productWidget.destroy();
```

## Cart Usage

### Create a cart widget

```js
const widgetWrapper = document.getElementById("cart-widget");
const cartWidget = api.cartWidget(widgetWrapper);
```

### destroy cart widget

```js
cartWidget.destroy();
```

## Listener

### Item added to cart

```js
api.on('addToCart', (itemId: ItemId, quantity: number, price: number) => {
    // do something
});
```

### Item removed from cart

```js
api.on('removeFromCart', (itemId: ItemId) => {
    // do something
});
```

### Item quantity changed

```js
api.on('changeCartQuantity', (itemId: ItemId, quantity: number, price: number) => {
    // do something
});
```
