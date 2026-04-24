import { spawn } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { packageStandalone } from "./package-standalone.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const feRoot = path.join(scriptDir, "..");
const repoRoot = path.join(feRoot, "..");
const require = createRequire(import.meta.url);

const nextCli = require.resolve("next/dist/bin/next", {
  paths: [feRoot, repoRoot],
});

async function runNextBuild() {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextCli, "build"], {
      cwd: feRoot,
      env: process.env,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`next build failed with exit code ${code}`));
    });

    child.on("error", reject);
  });
}

async function main() {
  await runNextBuild();
  await packageStandalone();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
