import path from "node:path";
import { toAVIF } from "./image";
import { checkArgs } from "./args";
import { readImageFiles, rmDir, saveAsTar } from "./fs";

const CWD = process.cwd();

interface TaskOptions {
  quality: number;
  exportOriginalTar: boolean;
  removeDir: boolean;
}

async function task(
  targetDir: string,
  { quality, exportOriginalTar, removeDir }: TaskOptions
) {
  const files = await readImageFiles(targetDir);
  if (exportOriginalTar) {
    await saveAsTar(targetDir, files, true);
  }

  const converted = await Promise.all(
    files.map((file) => toAVIF(file, quality).catch(() => file))
  );
  await saveAsTar(targetDir, converted, false);

  if (removeDir) {
    await rmDir(targetDir);
  }
}

let exit = false;

async function main() {
  const { targetDirs, quality, exportOriginal, removeOriginal } = checkArgs(
    Bun.argv
  );

  const targetPaths = Array.from(
    new Set(
      targetDirs.map((dir) => {
        return path.relative(CWD, dir || CWD) || CWD;
      })
    )
  );

  for (const path of targetPaths) {
    await task(path, { quality, exportOriginalTar: exportOriginal, removeDir: removeOriginal });
    if (exit) {
      process.exit(0);
    }
  }

  process.exit(0);
}

process.on('SIGINT', async () => {
  console.log('\nCtrl-C was pressed\nExit when the running task is completed');
  exit = true;
})

main();
