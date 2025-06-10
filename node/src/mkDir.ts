import fs from 'node:fs/promises';

export default async function mkDir(relativePath: string) {
  await fs.mkdir(relativePath, { recursive: true });
}