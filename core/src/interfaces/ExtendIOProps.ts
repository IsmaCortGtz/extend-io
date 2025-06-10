export interface ExtendIoFileSystem {
  readFile: (filePath: string, encode: 'utf8' | 'base64' | 'uint8array') => Promise<string | Uint8Array>;
  writeFile: (filePath: string, content: string | Uint8Array, encode: 'utf8' | 'base64' | 'uint8array') => Promise<void>;
  /** Should be recursive */
  mkDir: (dirPath: string) => Promise<void>;
}