# App-JS-SDK

The TECSAFE App-JS-SDK provides a convenience wrapper to interact with the TECSAFE App.

## API Usage

### Initialize the SDK

```js
const api = await TecsafeSdk.initializeTecsafeApi(async () => {
    const response = await fetch('https://mybackend.com/tecsafe/token');
    const json = await response.json();
    
    return json.token;
});
```

### Get the current user

```js
api.reloadToken();
```

## Cart Usage

### Create a cart widget

```js
const widget = api.cartWidget(widgetWrapper);
```

### destroy cart widget

```js
widget.destroy();
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