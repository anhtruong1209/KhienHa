import { spawn } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const feRoot = path.join(scriptDir, "..");
const repoRoot = path.join(feRoot, "..");
const backendRoot = path.join(repoRoot, "KhienHaFull");
const publicDir = path.join(backendRoot, "public");
const manifestPath = path.join(backendRoot, "bootstrap", "cache", "fe-static-manifest.json");
const generatedDataPath = path.join(feRoot, "src", "generated", "public-build-data.js");
const isWindows = process.platform === "win32";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

async function runCommand(command, args, options = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: isWindows,
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

async function writeBuildDataModule() {
  const json = await new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const child = spawn("php", [path.join(backendRoot, "scripts", "export-public-build-data.php")], {
      cwd: backendRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(new Error(stderr || `export-public-build-data.php failed with exit code ${code}`));
    });
  });

  const data = JSON.parse(json);
  const moduleSource = `export const publicBuildData = ${JSON.stringify(data, null, 2)};\n\nexport default publicBuildData;\n`;
  await writeFile(generatedDataPath, moduleSource, "utf8");
}

async function listFiles(rootDir, currentDir = rootDir) {
  const currentStat = await stat(currentDir);

  if (!currentStat.isDirectory()) {
    return [];
  }

  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await listFiles(rootDir, absolutePath));
      continue;
    }

    files.push(path.relative(rootDir, absolutePath).replaceAll("\\", "/"));
  }

  return files;
}

async function readPreviousManifest() {
  try {
    const content = await readFile(manifestPath, "utf8");
    return JSON.parse(content);
  } catch {
    return { files: [] };
  }
}

async function removePreviousFiles(files) {
  for (const relativePath of files) {
    if (!relativePath) {
      continue;
    }

    await rm(path.join(publicDir, relativePath), { force: true, recursive: true });
  }
}

async function copyOutputFiles(outputDir, files) {
  for (const relativePath of files) {
    const sourcePath = path.join(outputDir, relativePath);
    const destinationPath = path.join(publicDir, relativePath);

    await mkdir(path.dirname(destinationPath), { recursive: true });
    await cp(sourcePath, destinationPath, { force: true });
  }
}

async function main() {
  await writeBuildDataModule();

  await runCommand(npmCommand, ["run", "build"], {
    cwd: feRoot,
    env: {
      ...process.env,
      KHIENHA_FE_STATIC: "1",
    },
  });

  const outputDir = path.join(feRoot, "out");
  const files = await listFiles(outputDir);
  const previousManifest = await readPreviousManifest();

  await removePreviousFiles(previousManifest.files || []);
  await copyOutputFiles(outputDir, files);
  await writeFile(manifestPath, JSON.stringify({ files }, null, 2), "utf8");

  console.log(`Static FE exported to ${publicDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
