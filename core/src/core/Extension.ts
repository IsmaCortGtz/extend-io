import { ExtendIoFileSystem } from "src/interfaces/ExtendIOProps";
import type { AssetOptions, ExtensionProps, RunContext } from "../interfaces/ExtensionProps";
import { Permissions } from "./Permissions";

export class Extension {
  public uid: string;
  public name: string;
  public version: number[];
  public permissions: string[];
  public actions: Record<string, string[]>;
  public assets?: Record<string, string>;
  public variables?: Record<string, any>;
  private fs: ExtendIoFileSystem;

  constructor(props: ExtensionProps) {
    this.uid = props.uid;
    this.name = props.name;
    this.version = props.version;
    this.permissions = props.permissions;
    this.actions = props.actions;
    this.assets = props.assets;
    this.variables = props.variables;
    this.fs = props.fs;
  }

  public async run(action: string, ...args: any[]): Promise<unknown> {
    const actionFiles = this.actions?.[action];
    if (!actionFiles || !Array.isArray(actionFiles) || actionFiles.length === 0) {
      throw new Error(`Action '${action}' not found in extension '${this.uid}'.`);
    }

    const code = await Promise.all(
      actionFiles.map(async (file) => this.fs.readFile(`${this.uid}/${file}`, 'utf8') as Promise<string>)
    );

    if (Array.isArray(code) && code.length === 0) {
      throw new Error(`No code found for action '${action}' in extension '${this.uid}'.`);
    }

    const deps = await Permissions.getPermissionsList(this.permissions);
    if (!deps || typeof deps !== 'object') {
      throw new Error(`Dependencies for extension '${this.uid}' are not valid.`);
    }

    const finalCode = code.join(';');

    return this.rawRun(finalCode, {
      dependencies: Permissions.permissionTypeToArray(deps),
      args,
      caller: `if(typeof ${action}!=='function')throw new Error("${action} function is not defined");return ${action}(...args);`
    });
  }

  public async loadAsset(assetName: string, options?: AssetOptions): Promise<string | Uint8Array> {
    try {
      const assetPath = this.assets?.[assetName];
      if (!assetPath) throw new Error(`Asset '${assetName}' not found in extension '${this.uid}'.`);

      const encoding = options?.base64 ? 'base64' : 'uint8array';
      return await this.fs.readFile(`${this.uid}/${assetPath}`, encoding) as string | Uint8Array;
    } catch (error) {
      throw new Error(`Failed to load asset '${assetName}' from extension '${this.uid}': ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async rawRun(code: string, ctx: RunContext): Promise<unknown> {
    // Block specific features
    if (/(?:^|\s|;)\s*import\s*\([^)]*\)/i.test(code)) throw new Error("Dynacim import is not allowed");
    if (/\s*[^a-zA-Z0-9\;]prototype\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Prototype modification is not allowed");
    if (/\s*[^a-zA-Z0-9\;]__proto__\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Prototype modification is not allowed");
    if (/\s*[^a-zA-Z0-9\;]setPrototypeOf\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Prototype modification is not allowed");
    if (/\s*[^a-zA-Z0-9\;]eval\s*[^a-zA-Z0-9\;]/i.test(code)) throw new Error("Using eval is not allowed");

    const dependencies = {
      localStorage: undefined,
      sessionStorage: undefined,
      history: undefined,
      alert: undefined,
      confirm: undefined,
      prompt: undefined,
      Notification: undefined,
      postMessage: undefined,
      performance: undefined,
      WebAssembly: undefined,
      Worker: undefined,
      ServiceWorker: undefined,
      SharedWorker: undefined,
      indexedDB: undefined,
      navigator: undefined,
      document: undefined,
      window: undefined,
      Function: undefined,
      MutationObserver: undefined,
      ResizeObserver: undefined,
      requestAnimationFrame: undefined,
      Geolocation: undefined,
      DeviceMotionEvent: undefined,
      DeviceOrientation: undefined,
      MediaDevices: undefined,
      speechSynthesis: undefined,
      FileReader: undefined,
      FileSystem: undefined,
      BroadcastChannel: undefined,
      Clipboard: undefined,
      setTimeout: undefined,
      setInterval: undefined,
      setImmediate: undefined,
      clearTimeout: undefined,
      clearInterval: undefined,
      clearImmediate: undefined,
      XMLHttpRequest: undefined,
      fetch: undefined,
      process: undefined,
      console: undefined,
      cheerio: undefined,
      __dirname: undefined,
      __filename: undefined,
      global: undefined,
      globalThis: undefined,
      require: undefined,
      __proto__: undefined,

      // Custom dependencies
      ...ctx.dependencies
    }

    // Return result
    try {
      // const caller = `if(typeof run!=='function')throw new Error("run function is not defined");return run(...args);`;

      // Inject code
      const wrapped = new Function('args', ...Object.keys(dependencies), `
      "use strict";
      ${code}
      ${ctx.caller || 'return "No caller provided";'}
    `);

      return await wrapped(ctx.args || [], ...Object.values(dependencies));
    }
    catch (e: Error | unknown) {
      if (e instanceof Error) throw new Error(`Error runnig extension: ${e.message}`);
      else throw new Error(`Unknow error runnig extension.`);
    }
  }
}