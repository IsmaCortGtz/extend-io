import fs from 'native-universal-fs';

export default async function writeFile(filePath: string, content: string | Uint8Array, encode: 'utf8' | 'base64' | 'uint8array'): Promise<void> {
  try {
    if (encode === 'utf8' && typeof content === 'string') {
      await fs.writeFile(filePath, content as string, 'utf8');
    } else if (encode === 'base64' && typeof content === 'string') {
      await fs.writeFile(filePath, content as string, 'base64');
    } else if (encode === 'uint8array' && content instanceof Uint8Array) {
      const base64 = Buffer.from(content).toString('base64');
      await fs.writeFile(filePath, base64, 'base64');
    } else {
      throw new Error(`Unsupported encoding (${encode}) or content type (${typeof content}).`);
    }
  } catch (e) {
    throw e;
  }
}