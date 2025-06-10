import fs from 'native-universal-fs';
import { join } from './utils/join';

export default async function mkDir(base: string, relativePath: string) {
  const dirpath = join(base, relativePath);

  // Create dir recursive in relativePath
  const parts = relativePath.split(/[\\/]/);
  let current = base;
  for (const part of parts) {
    if (!part) continue;
    current = `${current}/${part}`;

    if (await fs.exists(current)) continue;
    await fs.mkdir(current);
  }

  if (!(await fs.exists(dirpath))) await fs.mkdir(relativePath);
}