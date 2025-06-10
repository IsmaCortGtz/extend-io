# @extend-io/browser

[![npm version](https://img.shields.io/npm/v/@extend-io/browser.svg)](https://www.npmjs.com/package/@extend-io/browser)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A tiny `Javascript` and `Typescript` wrapper of the [`@extend-io/core`](https://www.npmjs.com/package/@extend-io/core) library for the `Browser`.

## IMPORTANT

This library is **NOT** a sandbox environment and malicious code is not filtered. The run method has some simple protections to avoid common `prototypes` modifications and some `APIs` are disabled for security reasons, but it could stills insecure. ***Keep this in mind.***

Read more in the [security](#security) section.

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
- [CDN Usage](#cdn-usage)
- [Security](#security)
- [Documentation](#documentation)

## Installation

You can install this library with the following command.

```sh
npm install @extend-io/browser
```

## Usage

This wrapper can only be used in browsers that support the `Cache API`. You can build your own `file-system` implementation using another API and [`@extend-io/core`](https://www.npmjs.com/package/@extend-io/core).

The first step to use the library is create an instance of the `ExtendIO` class and pass a `file-system` implementation for the `browser`.

### Browser `file-system` implementation

This library exports a `fileSystem` function that returns an object with the `file-system` implementation. This function accepts a param that represent the cache name that `Cache API` will use to store files.

```js
import { ExtendIO, fileSystem } from '@extend-io/browser';

// By default the param will be 'extendio-cache'
const extensionsContainer = new ExtendIO(fileSystem());

// base64 of the zip extension without prefix:  data:application/zip;base64,...
// uint8array of the zip extension
const extensionZip = '...';
await extensionsContainer.registerExtension(extensionZip)
```

Additionally, this library exports as default an instance of the `ExtendIO` class with the `fileSystem` using default param.

```js
import extensionsContainer from '@extend-io/browser';

// base64 of the zip extension without prefix:  data:application/zip;base64,...
// uint8array of the zip extension
const extensionZip = '...';
await extensionsContainer.registerExtension(extensionZip)
```

Then, you can get a `Extension` instance with the information of the installed extension, you need to pass the same `uid` that extension has in `manifest.json`. See [Extension API](https://github.com/IsmaCortGtz/extend-io/blob/master/docs/ExtensionAPI.md) for more details.

```js
const extension = await extensionsContainer.getExtension('778e5b41-716f-4976-bc45-274a490baab1');
```

With the `Extension` instance we can run an `action`, and load assets.

```typescript
// Run code (you can pass any args)
const result = await extension.run('actionName', ...args[]);

// Load assets (base64 or uint8array)
const icon = await extension.loadAsset('assetName', { base64: true });
```

### `Permissions`

Some `APIs` are disabled by default for security reassons. But you can re-eanble them or extend functionallity to extension's usage. `Permissions` is a static class that store some permissions that your extensions can use to run a custom API provided by your app. Permissions aren't present by default if `manifest.json` doean't include them.

***Note:*** `Permissions` are loaded when you execute `run` method.

This object has a lot of methods to use, but usually you only need to care about `setPermissions`. This method expects three arguments:

- `permissionID`: A ***string*** representing the permission ID that extensions will need to include in `manifest.json`.
- `permissionName`: A ***string*** representing the name that permission will have globally in the extension code.
- `value`: ***any***. The value of the extension, this could be any type (usually objects on functions).

```js
import { Permissions } from '@extend-io/browser';

// Re-enable fetch api with a custom ID
Permissions.setPermissions('permission.native.fetch', 'fetch', fetch);

// Custom permission
Permissions.setPermissions('permission.custom.example', 'example', {
  sum: (a, b) => a + b;
});

/*
In code you can use it like:
example.sum(1, 2); // 3
*/
```

## CDN Usage

You can test the library using a CDN. In github and NPM will be a file under [`dist/iife/index.cdn.js`](./dist//iife//index.cdn.js) for CDN usage, you can use the CDN provider that you want.

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@extend-io/browser/dist/iife/index.cdn.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/@extend-io/browser/dist/iife/index.cdn.js"></script>
```

When CDN is used, exported values will be under `ExtendIO` name, and default export will be in `ExtendiIO.default`.

```js
// Re-enable fetch api with a custom ID
ExtendIO.Permissions.setPermissions('permission.native.fetch', 'fetch', fetch);

// Custom permission
ExtendIO.Permissions.setPermissions('permission.custom.example', 'example', {
  sum: (a, b) => a + b;
});

/*
In code you can use it like:
example.sum(1, 2); // 3
*/

// const extensionsContainer = ExtendIO.default;
const extensionsContainer = new ExtendIO.ExtendIO(ExtendIO.fileSystem());

// base64 of the zip extension without prefix:  data:application/zip;base64,...
// uint8array of the zip extension
const extensionZip = '...';
await extensionsContainer.registerExtension(extensionZip);
```

## Security

When code is executed the `Extension` class runs some simple verifications. Even so, code is runned using the `Function` constructor and is **NOT** sandboxed, suspicius code will be executed anyway if verifications are passed. ***Keep this in mind.***

***Note***: JS is a very flexible language, so there could be other ways to bypasing this verifications. If you know a way to improve this you can open an `issue` or a `pull request`.

### Prototype modification

Prototype modifications are disabled using the following regex. This disables any usage of the following words, so extensions can't use them at all.

```js
if (/\s*[^a-zA-Z0-9\;]prototype\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Prototype modification is not allowed");
if (/\s*[^a-zA-Z0-9\;]__proto__\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Prototype modification is not allowed");
if (/\s*[^a-zA-Z0-9\;]setPrototypeOf\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Prototype modification is not allowed");
```

### Dynamic imports and `eval`

This features are disabled using regex too.

```js
if (/(?:^|\s|;)\s*import\s*\([^)]*\)/i.test(code)) throw new Error("Dynacim import is not allowed");
if (/\s*[^a-zA-Z0-9\;]eval\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Using eval is not allowed");
```

### Native APIs

Some native APIs are disabled by default to avoid unexpected behavior when extensions are executed. This APIs are disabled defining a gloabl const with the same name to `undefined`.

You can re-enable this APIs using the `Permissions` class.

```js
{
  localStorage: undefined,
  sessionStorage: undefined,
  history: undefined,
  alert: undefined,
  confirm: undefined,
  prompt: undefined,
  Notification: undefined,
  postMessage: undefined,
  performance: undefined,
  WebAssembly: undefined,
  Worker: undefined,
  ServiceWorker: undefined,
  SharedWorker: undefined,
  indexedDB: undefined,
  navigator: undefined,
  document: undefined,
  window: undefined,
  Function: undefined,
  MutationObserver: undefined,
  ResizeObserver: undefined,
  requestAnimationFrame: undefined,
  Geolocation: undefined,
  DeviceMotionEvent: undefined,
  DeviceOrientation: undefined,
  MediaDevices: undefined,
  speechSynthesis: undefined,
  FileReader: undefined,
  FileSystem: undefined,
  BroadcastChannel: undefined,
  Clipboard: undefined,
  setTimeout: undefined,
  setInterval: undefined,
  setImmediate: undefined,
  clearTimeout: undefined,
  clearInterval: undefined,
  clearImmediate: undefined,
  XMLHttpRequest: undefined,
  fetch: undefined,
  process: undefined,
  console: undefined,
  cheerio: undefined,
  __dirname: undefined,
  __filename: undefined,
  global: undefined,
  globalThis: undefined,
  require: undefined,
  __proto__: undefined
}
```

## Documentation

You can read a detailed API documentation in the [github repository](https://github.com/IsmaCortGtz/extend-io).

- [Extension API](https://github.com/IsmaCortGtz/extend-io/blob/master/docs/ExtensionAPI.md)
- [`file-system` implementations](https://github.com/IsmaCortGtz/extend-io/blob/master/docs/API/FileSystem.md)
- [`ExtendIO` class](https://github.com/IsmaCortGtz/extend-io/blob/master/docs/API/ExtendIO.md)
- [`Extension` class](https://github.com/IsmaCortGtz/extend-io/blob/master/docs/API/Extension.md)
- [`Permissions` class](https://github.com/IsmaCortGtz/extend-io/blob/master/docs/API/Permissions.md)
