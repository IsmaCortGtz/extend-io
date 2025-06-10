export default async function writeFile(cache: Cache, filePath: string, content: string | Uint8Array, encode: 'utf8' | 'base64' | 'uint8array'): Promise<void> {
  try {
    const file = (`/extendio-cache-file-system-url/${filePath}`).replace('//', '/');
    return cache.put(file, new Response(content, {
      headers: { 'Content-Encoding': encode }
    }));
  } catch (e) {
    throw e;
  }
}