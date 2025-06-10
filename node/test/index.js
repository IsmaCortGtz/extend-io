import fs from 'node:fs';
import path from 'node:path';
import extendIo, { Permissions } from '..';

Permissions.setPermissions('permission.native.fetch', 'fetch', fetch);
Permissions.setPermissions('permission.native.console', 'console', { log: (...args) => console.log(...args) });

// Default in node has an instance of ExtendIO with default file system
// const extendIo = new ExtendIO(fileSystem());

// const zipFilepath = path.join(import.meta.dirname, 'extension.zip');
// const zip = fs.readFileSync(zipFilepath, 'base64');
// await extendIo.registerExtension(zip);
const extension = await extendIo.getExtension('778e5b41-716f-4976-bc45-274a490baab1');

const result = await extension.run('list', 'Hola, como estas?');
// console.log('result loaded:', result);