import JSZip from "jszip";
import { ExtendIoFileSystem } from "../interfaces/ExtendIOProps";
import { ExtensionConfigFile } from "src/interfaces/ExtensionProps";
import { Extension } from "./Extension";

export class ExtendIO {
  private fs: ExtendIoFileSystem;

  constructor(props: ExtendIoFileSystem) {
    this.fs = props;
  }

  public async registerExtension(jsZip: string | Uint8Array): Promise<void> {
    const zip = new JSZip();
    await zip.loadAsync(jsZip, { base64: typeof jsZip === 'string' });

    // Check if manifest.json exists
    if (!zip.file("manifest.json")) {
      throw new Error("manifest.json is required in the extension zip file");
    }

    // Read and parse manifest.json
    const manifestContent = await zip.file("manifest.json")!.async("string");
    const manifest: ExtensionConfigFile = JSON.parse(manifestContent);
    if (!manifest.uid || !manifest.name || !manifest.version || !manifest.permissions || !manifest.actions) {
      throw new Error("manifest.json is missing required fields");
    }

    zip.forEach(async (relativePath, file) => {
      if (!file.dir) {
        const content = await file.async("uint8array");
        this.fs.writeFile(`${manifest.uid}/${relativePath}`, content, "uint8array");
      } else {
        this.fs.mkDir(`${manifest.uid}/${relativePath}`);
      }
    });
  }

  public async getExtension(uid: string): Promise<Extension> {
    try {
      const manifestContent = await this.fs.readFile(`${uid}/manifest.json`, "utf8") as string;
      const manifest: ExtensionConfigFile = JSON.parse(manifestContent);

      return new Extension({ ...manifest, fs: this.fs });
    } catch (error) {
      throw new Error(`Failed to get extension with UID ${uid}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}