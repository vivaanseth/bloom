import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const roots = ["src", "src-tauri/src", "index.html", "vite.config.ts"];
const ignoredDirs = new Set(["node_modules", "dist", "target", ".git", "gen"]);
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".rs", ".html"]);

const appNetworkPattern = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/;
const analyticsPattern = /\b(?:analytics|telemetry|sentry|posthog|segment)\s*(?:\.|\(|=|:|from\b)/i;
const localPathPattern = new RegExp(
  ["/Users/", "/home/", "C:\\\\Users\\\\", "\\.co" + "dex", "\\.ag" + "ents"].join("|"),
  "i",
);
const invasiveApiPattern = /\b(?:getDisplayMedia|getUserMedia|navigator\.clipboard|clipboard\.read|clipboard\.write|addEventListener\(["']keydown|globalShortcut)\b/;

async function collectFiles(entry) {
  const absolute = path.join(repoRoot, entry);
  const statEntries = await readdir(absolute, { withFileTypes: true }).catch(async () => null);

  if (!statEntries) {
    return sourceExtensions.has(path.extname(entry)) ? [absolute] : [];
  }

  const files = [];
  for (const dirent of statEntries) {
    if (ignoredDirs.has(dirent.name)) continue;
    const child = path.join(entry, dirent.name);
    if (dirent.isDirectory()) {
      files.push(...(await collectFiles(child)));
    } else if (sourceExtensions.has(path.extname(dirent.name))) {
      files.push(path.join(repoRoot, child));
    }
  }
  return files;
}

const failures = [];

for (const root of roots) {
  for (const absolute of await collectFiles(root)) {
    const relative = path.relative(repoRoot, absolute);
    const lines = (await readFile(absolute, "utf8")).split("\n");
    lines.forEach((line, index) => {
      const compact = line.trim();
      if (appNetworkPattern.test(compact)) {
        failures.push(`${relative}:${index + 1} uses a network-capable browser API.`);
      }
      if (analyticsPattern.test(compact)) {
        failures.push(`${relative}:${index + 1} mentions analytics or telemetry implementation.`);
      }
      if (localPathPattern.test(compact)) {
        failures.push(`${relative}:${index + 1} contains a local machine path or Codex-only path.`);
      }
      if (invasiveApiPattern.test(compact)) {
        failures.push(`${relative}:${index + 1} uses an invasive data-source API.`);
      }
    });
  }
}

if (failures.length > 0) {
  throw new Error(`Privacy boundary scan failed:\n- ${failures.join("\n- ")}`);
}

console.log("Privacy boundary scan passed.");
