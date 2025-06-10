import fs from 'native-universal-fs';
import { join } from './utils/join';

import mkDir from "./mkDir";
import writeFile from "./writeFile";
import readFile from "./readFile";

const defaultAbsolutePath = join(fs.DocumentDirectoryPath, 'extendio');

export function fileSystem(absolutPath: string = defaultAbsolutePath) {
  return {
    mkDir: (relativePath: string) => mkDir(absolutPath, relativePath),
    writeFile: (filePath: string, content: string | Uint8Array, encode: "utf8" | "base64" | "uint8array") => writeFile(join(absolutPath, filePath), content, encode),
    readFile: (filePath: string, encode: "utf8" | "base64" | "uint8array") => readFile(join(absolutPath, filePath), encode),
  }
}


import { ExtendIO } from "@extend-io/core";
export * from '@extend-io/core';
export default new ExtendIO(fileSystem());