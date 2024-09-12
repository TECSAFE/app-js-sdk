# App-JS-SDK

The TECSAFE App-JS-SDK provides a convenience wrapper to interact with the TECSAFE App.

## API Usage

The App-JS-SDK is on npm publicly available. You can install it via npm or yarn.

```bash
npm install @tecsafe/app-js-sdk
```

### Initialize the SDK

```js
import { TecsafeAPI } from "@tecsafe/app-js-sdk"; // or require("@tecsafe/app-js-sdk");
const api = new TecsafeAPI(async () => {
  const response = await fetch("https://mybackend.com/tecsafe/token");
  const json = await response.json();
  return json.token;
});
```

It is important to only instantiate the API once, as other wise the SDK could fetch multiple tokens.

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

## Example Implementation

```html
<template>
  <shop-base>
    <product-preview />
    <div ref="container" />
    <product-detail />
    <product-comments />
  </shop-base>
</template>

<script lang="ts" setup>
import { TecsafeApi } from '@tecsafe/app-js-sdk';
const container = ref<HTMLElement | null>(null);
const api = ref<TecsafeApi | null>(null);

onMounted(() => {
  if (!container.value) throw new Error("Container not found");
  api.value = new TecsafeApi(async () => {
    const response = await fetch("https://mybackend.com/tecsafe/token");
    const json = await response.json();
    return json.token;
  });
  api.value.createCartWidget(container.value);
});

onBeforeUnmount(() => {
  if (!api.value) return;
  api.value.destroyAll();
});
</script>
```
