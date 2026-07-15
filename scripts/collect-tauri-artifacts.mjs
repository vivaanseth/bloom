import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const platform = process.argv[2];
const version = (process.argv[3] ?? process.env.npm_package_version ?? "").replace(/^v/, "");
const outDir = process.argv[4] ?? "release-dist";

if (!platform || !version) {
  throw new Error("Usage: node scripts/collect-tauri-artifacts.mjs <macos|windows|linux> <version> [out-dir]");
}

const artifactRules = {
  macos: [
    { extension: ".dmg", name: `Bloom-${version}-mac-universal.dmg`, required: true },
  ],
  windows: [
    { extension: ".exe", name: `Bloom-${version}-win-x64.exe`, required: true },
  ],
  linux: [
    { extension: ".AppImage", name: `Bloom-${version}-linux-x86_64.AppImage`, required: true },
    { extension: ".deb", name: `Bloom-${version}-linux-amd64.deb`, required: true },
    { extension: ".rpm", name: `Bloom-${version}-linux-x86_64.rpm`, required: false },
  ],
};

const rules = artifactRules[platform];
if (!rules) {
  throw new Error(`Unknown platform "${platform}".`);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
    } else {
      files.push(absolute);
    }
  }
  return files;
}

function matchesExtension(file, extension) {
  return extension === ".AppImage" ? file.endsWith(".AppImage") : path.extname(file) === extension;
}

const files = await walk("src-tauri/target");
await mkdir(outDir, { recursive: true });

const copied = [];

for (const rule of rules) {
  const candidates = [];
  for (const file of files) {
    if (!matchesExtension(file, rule.extension)) continue;
    const fileStat = await stat(file);
    candidates.push({ file, mtimeMs: fileStat.mtimeMs, size: fileStat.size });
  }

  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs || b.size - a.size);
  const selected = candidates[0];

  if (!selected) {
    if (rule.required) {
      throw new Error(`No ${rule.extension} artifact found for ${platform}.`);
    }
    continue;
  }

  const destination = path.join(outDir, rule.name);
  await copyFile(selected.file, destination);
  copied.push(`${selected.file} -> ${destination}`);
}

console.log(`Collected ${copied.length} ${platform} artifact(s):`);
for (const item of copied) {
  console.log(`- ${item}`);
}
