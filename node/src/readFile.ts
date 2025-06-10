import fs from 'node:fs/promises';

export default async function readFile(filePath: string, encode: 'utf8' | 'base64' | 'uint8array'): Promise<string | Uint8Array> {
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
}