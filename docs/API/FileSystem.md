# `file-system` implementations

The package `@extend-io/core` needs a `file-system` implementation when a `ExtendIO` instance is created. This how the package works in different platforms, this object is used internally to save and load files (code and assets).

I recommend using some of the platform wrappers that exports an implementation for each platform. But you can always create your own to handle `file-system` operations.

## Table of Content

- [Wrappers](#wrappers)
- [The `readFile` method](#the-readfile-method)
- [The `writeFile` method](#the-writefile-method)
- [The `mkDir` method](#the-mkdir-method)

## Wrappers

Using these wrappers, you don't need to install `@extend-io/core` and you don't need to care about this step, but the API and usage keep the same.

- [`@extend-io/node`](https://www.npmjs.com/package/@extend-io/node)
- [`@extend-io/browser`](https://www.npmjs.com/package/@extend-io/browser)
- [`@extend-io/react-native`](https://www.npmjs.com/package/@extend-io/react-native)

## The `readFile` method

This method accepts two params and returns a promise that resolves in the read content.

- `filePath`: ***string***, the relative path of the file, usually will be like this: `[extension-uid]/src/example.js`. How directories and files are internally managed depdens in each `file-system`.

- `encode`: ***'utf8' | 'base64' | 'uint8array'***, this is a string that represents the encode that `ExtendIO` expects of the file, when code or a json file are loaded usually `utf8` is used, with assets usually `uint8array` or `base64` are used.

- *`Return`*: ***Promise<string | Uint8Array>*** this is the result that `ExtendIO` expects depending in `encode` param.

### `readFile` Example

```typescript
// NodeJS example

const readFile = async (filePath: string, encode: 'utf8' | 'base64' | 'uint8array') => {
    try {
      if (encode === 'utf8') {
        return await fs.readFile(filePath, 'utf8');
      } else {
        const buffer = await fs.readFile(filePath);
        if (encode === 'base64') {
          return buffer.toString('base64');
        } else if (encode === 'uint8array') {
          return new Uint8Array(buffer);
        } else {
          throw new Error(`Unsupported encoding: ${encode}`);
        }
      }
    } catch {
      throw new Error(`Error reading file at ${filePath} with ${encode}`);
    }
};
```

## The `writeFile` method

This method accepts three params and returns a void promise. If an error occurs it should throw an error.

- `filePath`: ***string***, the relative path of the file, usually will be like this: `[extension-uid]/src/example.js`. How directories and files are internally managed depdens in each `file-system`.

- `content`: ***string | Uint8Array***, the value that will be saved in the file. With `utf8` or `base64` encodes the method expects `string`. `Uint8Array` is used for binary files like images.

- `encode`: ***'utf8' | 'base64' | 'uint8array'***, this is a string that represents the encode that `ExtendIO` expects to save in the file, when code or a json file are loaded usually `utf8` is used, with assets usually `uint8array` or `base64` are used.

### `writeFile` Example

```typescript
// NodeJS example

const writeFile = async (filePath: string, content: string | Uint8Array, encode: 'utf8' | 'base64' | 'uint8array') => {
    try {
      if (encode === 'utf8' && typeof content === 'string') {
        await fs.writeFile(filePath, content as string, 'utf8');
      } else if (encode === 'base64' && typeof content === 'string') {
        const buffer = Buffer.from(content, 'base64');
        await fs.writeFile(filePath, buffer);
      } else if (encode === 'uint8array' && content instanceof Uint8Array) {
        await fs.writeFile(filePath, Buffer.from(content));
      } else {
        throw new Error(`Unsupported encoding (${encode}) or content type (${typeof content}).`);
      }
    } catch (e) {
      throw e;
    }
};
```

## The `mkDir` method

***Note:*** *With implementations like CacheAPI where there aren't directories you can inmedialty resolve a void promise in the `mkDir` method.*

This method accepts one param and returns a void promise. If an error occurs it should throw an error. This method needs to be recursive.

- `filePath`: ***string***, the relative path of the file, usually will be like this: `[extension-uid]/src/example.js`. How directories and files are internally managed depdens in each `file-system`.

### `mkDir` Example

```typescript
// NodeJS example
const mkDir = async (filePath: string) => {
  await fs.mkdir(relativePath, { recursive: true });
};

// Browser Cache API example
const mkDir = async (filePath: string) => {}
```
