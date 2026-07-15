import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const directory = process.argv[2] ?? "release-assets";
const version = (process.argv[3] ?? process.env.npm_package_version ?? "").replace(/^v/, "");

if (!version) {
  throw new Error("Usage: node scripts/verify-release-assets.mjs <dir> <version>");
}

const expected = [
  `Bloom-${version}-mac-universal.dmg`,
  `Bloom-${version}-win-x64.exe`,
  `Bloom-${version}-linux-x86_64.AppImage`,
  `Bloom-${version}-linux-amd64.deb`,
  `Bloom-v${version}-macos-sbom.cdx.json`,
  `Bloom-v${version}-windows-sbom.cdx.json`,
  `Bloom-v${version}-linux-sbom.cdx.json`,
  "SHASUMS256.txt",
];

const actual = new Set(await readdir(directory));
const missing = expected.filter((file) => !actual.has(file));
if (missing.length > 0) {
  throw new Error(`Missing release assets:\n- ${missing.join("\n- ")}`);
}

const manifest = await readFile(path.join(directory, "SHASUMS256.txt"), "utf8");
for (const file of expected.filter((entry) => entry !== "SHASUMS256.txt")) {
  if (!manifest.includes(file)) {
    throw new Error(`Checksum manifest does not include ${file}.`);
  }
}

console.log(`Release asset manifest is complete for ${version}.`);
