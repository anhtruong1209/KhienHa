import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const feRoot = path.join(scriptDir, "..");
const repoRoot = path.join(feRoot, "..");
const outputDir = path.join(repoRoot, "backend", "FE");
const standaloneRoot = path.join(feRoot, ".next", "standalone");

async function copyIfExists(source, destination) {
  await cp(source, destination, { recursive: true, force: true, dereference: true });
}

async function main() {
  const standaloneAppDir = path.join(standaloneRoot, "FE");
  const standaloneNodeModulesDir = path.join(standaloneRoot, "node_modules");
  const staticDir = path.join(feRoot, ".next", "static");
  const publicDir = path.join(feRoot, "public");

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await copyIfExists(standaloneAppDir, outputDir);
  await copyIfExists(standaloneNodeModulesDir, path.join(outputDir, "node_modules"));
  await copyIfExists(publicDir, path.join(outputDir, "public"));

  await mkdir(path.join(outputDir, ".next"), { recursive: true });
  await copyIfExists(staticDir, path.join(outputDir, ".next", "static"));
  await rm(path.join(outputDir, ".env"), { force: true });

  console.log(`Standalone FE bundle created at ${outputDir}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { main as packageStandalone };
