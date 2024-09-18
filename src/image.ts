import { AVIF, REG_EXT } from "./const";
import type { ImageEntry } from "./fs";
import { optimizeImage } from "wasm-image-optimization-avif/node";

export async function toAVIF(entry: ImageEntry, quality: number): Promise<ImageEntry> {
  const buffer = await optimizeImage({
    image: entry.data,
    quality
  });
  if (buffer == null) throw new Error(`Could not convert: ${entry.name}`)
  return {
    name: replaceFilenameAvif(entry.name),
    data: buffer
  }
}

function replaceFilenameAvif(filename: string): string {
  return filename.replace(REG_EXT, AVIF);
}
