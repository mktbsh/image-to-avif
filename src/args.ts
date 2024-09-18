import { parseArgs } from "node:util";

interface ArgsCheckResult {
  targetDirs: string[];
  quality: number;
  removeOriginal: boolean
  exportOriginal: boolean
}

export function checkArgs(args: string[]): ArgsCheckResult {
  const { values, positionals } = parseArgs({
    args,
    options: {
      q: {
        type: "string",
      },
      rmdir: {
        type: "boolean"
      },
      original: {
        type: "boolean"
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const [_bun, _cmd, ...targetDirs] = positionals;
  if (!targetDirs.length) {
    console.log("img2avif <target_path>");
    process.exit(1);
  }

  return {
    quality: Number.parseInt(values.q || "60"),
    targetDirs: Array.from(new Set(targetDirs)),
    exportOriginal: values.original || false,
    removeOriginal: values.rmdir || false,
  };
}
