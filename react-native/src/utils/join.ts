export function join(...paths: string[]): string {
  const separator = '/';
  return paths.join(separator).replace(/\/+/g, separator);
}