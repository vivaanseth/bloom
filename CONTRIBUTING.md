# Contributing To Bloom

Thanks for taking a look at Bloom.

Bloom is a local-first desktop app. Contributions should preserve the product
rules in `AGENTS.md`, especially privacy by architecture, registered actions,
and suggest-never-auto-execute behavior.

## Development

Use Node 24, npm, Rust stable, and the Tauri 2 toolchain.

```bash
npm install
npm run tauri -- dev
```

## Checks

Run the relevant checks before opening a pull request:

```bash
npm run typecheck
npm run lint
npm run test
npm run scan:privacy
npm run build
cargo fmt --check --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --all-features -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
```

Use synthetic data in tests. Do not add tests that require Ollama, internet
access, real user activity, or a specific desktop environment.

## Feature Honesty

Do not document planned behavior as implemented. If a feature is mocked,
synthetic, unavailable, or platform-limited, keep the UI and docs explicit.
