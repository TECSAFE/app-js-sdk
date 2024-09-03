# App-JS-SDK

The TECSAFE App-JS-SDK provides a convenience wrapper to interact with the TECSAFE App.

## API Usage

### Initialize the SDK

```js
import { TecsafeAPI } from "@tecsafe/app-js-sdk"; // or require("@tecsafe/app-js-sdk");
const api = new TecsafeAPI(async () => {
  const response = await fetch("https://mybackend.com/tecsafe/token");
  const json = await response.json();
  return json.token;
});
```

### Create a Widget

The createWidget method creates a widget and appends it to the given element.

```js
const cartWidget = api.createCartWidget(document.getElementById("cart-widget"));
const pdWidget = api.createProductDetailWidget(document.getElementById("product-detail-widget"));
```

### Update the token

If an user logs in or logs out, you can update the token by calling the `refreshToken` method.

```js
api.refreshToken();
// this will call the tokenFN from the constructor,
// alternatively you can also pass the token directly:
api.refreshToken("new-token");
```

### Destroy all widgets

If an user withdraws consent, or the user navigates away from the page (relevant for SPA), you can destroy all widgets by calling the `destroy` method.

```js
api.destroy();
```
