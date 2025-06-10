import fs from 'native-universal-fs';

export default async function readFile(filePath: string, encode: 'utf8' | 'base64' | 'uint8array'): Promise<string | Uint8Array> {
  try {
    if (encode === 'utf8') {
      return await fs.readFile(filePath, 'utf8');
    } else {
      const base64 = await fs.readFile(filePath, 'base64');
      if (encode === 'base64') return base64;
      else if (encode === 'uint8array') {
        return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      }

      throw new Error(`Unsupported encoding: ${encode}`);
    }
  } catch {
    throw new Error(`Error reading file at ${filePath} with ${encode}`);
  }
}