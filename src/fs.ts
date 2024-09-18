import { basename, resolve } from "node:path";
import fs from "node:fs/promises";
import { REG_EXT } from "./const";
import { createTar } from "nanotar";

export interface ImageEntry {
  name: string;
  data: Buffer | Uint8Array
}

export async function readImageFiles(targetDir: string): Promise<ImageEntry[]> {
  const entries = await fs.readdir(targetDir, { withFileTypes: true });
  const files = entries.filter((v) => v.isFile() && REG_EXT.test(v.name));

  return Promise.all(files.map(async (file) => {
    const filePath = resolve(targetDir, file.name);
    const data = await fs.readFile(filePath)
    return {
      name: file.name,
      data
    }
  }))
}

export async function saveAsTar(targetDir: string, images: ImageEntry[], isOriginal: boolean) {
  const filename = [basename(targetDir), isOriginal ? "original" : "", "tar"].filter(Boolean).join('.')
  const file = Bun.file(resolve(process.cwd(), filename));
  return Bun.write(file, createTar(images));
}

export async function rmDir(dir: string) {
  return fs.rmdir(dir, { recursive: true })
}
