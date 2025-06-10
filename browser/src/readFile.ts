export default async function readFile(cache: Cache, filePath: string, encode: 'utf8' | 'base64' | 'uint8array'): Promise<string | Uint8Array> {
  try {
    const file = (`/extendio-cache-file-system-url/${filePath}`).replace('//', '/');
    const response = await cache.match(file);
    if (!response) {
      throw new Error(`File not found: ${filePath}`);
    }

    switch (encode) {
      case 'utf8':
        return response.text();
      case 'base64':
        const arrayBuffer = await response.arrayBuffer();
        return btoa(String.fromCharCode(...Array.from(new Uint8Array(arrayBuffer))));
      case 'uint8array':
        return new Uint8Array(await response.arrayBuffer());
      default:
        throw new Error(`Unsupported encoding: ${encode}`);
    }
  } catch (e) {
    throw e;
  }
}