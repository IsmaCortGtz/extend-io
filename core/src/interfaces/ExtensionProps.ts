import { ExtendIoFileSystem } from "./ExtendIOProps";
import { PermissionDictionary } from "./PermissionsType";

export interface AssetOptions {
  base64?: boolean;
}

export interface ExtensionConfigFile {
  /** Needs to be unique */
  uid: string,
  name: string,
  version: number[],
  permissions: string[],
  actions: Record<string, string[]>
  assets?: Record<string, string>;
  variables?: Record<string, any>;
}

export interface ExtensionProps extends ExtensionConfigFile {
  fs: ExtendIoFileSystem;
}

export interface RunContext {
  dependencies: PermissionDictionary;
  args: any[];
  caller: string;
}