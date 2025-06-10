import writeFile from "./writeFile";
import readFile from "./readFile";

export async function fileSystem(cahceName: string = 'extendio-cache') {
  const cacheAvailable = 'caches' in self;
  if (!cacheAvailable) {
    throw new Error("Caches API is not available in this environment.");
  }

  const cache = await caches.open(cahceName);
  return {
    /** MkDir no needed for cache in browser */
    mkDir: async (relativePath: string) => { },
    writeFile: async (filePath: string, content: string | Uint8Array, encode: 'utf8' | 'base64' | 'uint8array') =>
      writeFile(cache, filePath, content, encode),
    readFile: async (filePath: string, encode: 'utf8' | 'base64' | 'uint8array') =>
      readFile(cache, filePath, encode),
  }
}

import { ExtendIO } from "@extend-io/core";
export * from '@extend-io/core';
export default new ExtendIO(await fileSystem());