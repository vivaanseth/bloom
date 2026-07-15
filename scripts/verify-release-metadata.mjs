import { access, readFile } from "node:fs/promises";

const tagOrVersion = process.argv[2] ?? process.env.VERSION ?? "";
const version = tagOrVersion.replace(/^v/, "");

if (!version) {
  throw new Error("Usage: node scripts/verify-release-metadata.mjs <tag-or-version>");
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const tauriConfig = JSON.parse(await readFile("src-tauri/tauri.conf.json", "utf8"));
const cargoToml = await readFile("src-tauri/Cargo.toml", "utf8");
const changelog = await readFile("CHANGELOG.md", "utf8");
const releaseNotesPath = `docs/releases/v${version}.md`;
const releaseNotes = await readFile(releaseNotesPath, "utf8");

const cargoVersion = cargoToml.match(/^version = "([^"]+)"/m)?.[1];
const cargoName = cargoToml.match(/^name = "([^"]+)"/m)?.[1];
const cargoRepository = cargoToml.match(/^repository = "([^"]+)"/m)?.[1];

const checks = [
  [packageJson.name === "bloom", "package.json name must be bloom"],
  [packageJson.private === false, "package.json must be public"],
  [packageJson.version === version, "package.json version must match tag"],
  [cargoName === "bloom", "Cargo package name must be bloom"],
  [cargoVersion === version, "Cargo version must match tag"],
  [cargoRepository === "https://github.com/vivaanseth/bloom", "Cargo repository must point to GitHub"],
  [tauriConfig.productName === "Bloom", "Tauri productName must be Bloom"],
  [tauriConfig.version === version, "Tauri version must match tag"],
  [tauriConfig.identifier === "io.github.vivaanseth.bloom", "Tauri identifier must be stable"],
  [tauriConfig.app?.security?.csp && tauriConfig.app.security.csp !== null, "Tauri CSP must be enabled"],
  [changelog.includes(`## ${version} -`), "CHANGELOG.md must include the release version"],
  [releaseNotes.includes("unsigned"), "Release notes must mention unsigned artifacts"],
  [releaseNotes.includes("alpha"), "Release notes must identify this as an alpha"],
  [releaseNotes.includes("does not monitor real apps"), "Release notes must not overclaim implemented features"],
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
if (failures.length > 0) {
  throw new Error(`Release metadata check failed:\n- ${failures.join("\n- ")}`);
}

await access(releaseNotesPath);
console.log(`Release metadata is consistent for ${version}.`);
