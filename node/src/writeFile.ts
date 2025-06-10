import fs from 'node:fs/promises';

export default async function writeFile(filePath: string, content: string | Uint8Array, encode: 'utf8' | 'base64' | 'uint8array'): Promise<void> {
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
}