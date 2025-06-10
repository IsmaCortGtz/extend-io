import path from "node:path";
import mkDir from "./mkDir";
import writeFile from "./writeFile";
import readFile from "./readFile";

export function fileSystem(relPath: string = 'extendio') {
  const absolutPath = path.resolve(relPath);
  return {
    mkDir: (relativePath: string) => mkDir(path.join(absolutPath, relativePath)),
    writeFile: (filePath: string, content: string | Uint8Array, encode: "utf8" | "base64" | "uint8array") => writeFile(path.join(absolutPath, filePath), content, encode),
    readFile: (filePath: string, encode: "utf8" | "base64" | "uint8array") => readFile(path.join(absolutPath, filePath), encode),
  }
}


import { ExtendIO } from "@extend-io/core";
export * from '@extend-io/core';
export default new ExtendIO(fileSystem());