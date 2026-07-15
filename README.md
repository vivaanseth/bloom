# Bloom

Bloom is a local-first desktop companion app for macOS, Windows, and Linux. It
uses Tauri 2, React, TypeScript, Vite, and Rust.

The current public release is `v0.1.0-alpha.1`. It is an unsigned app-shell
alpha: useful for trying the companion window, tray, dashboard, and visual
direction, but not yet the finished assistant.

Bloom is distributed as a desktop app through GitHub Releases. There is no
hosted website build, cloud service, account system, or analytics backend.

## What Works Today

- Tauri 2 shell with `companion` and `dashboard` windows.
- System tray menu for showing the companion, opening the dashboard, pausing or
  resuming learning, and quitting.
- CSS-animated corner companion with speech bubbles.
- Mock suggestion with Accept, Dismiss, Snooze, Disable this suggestion, and
  Why am I seeing this controls.
- In-memory Rust state for learning pause and mock suggestion feedback.
- Synthetic activity view and platform capability display.
- Rust action-validation contracts and inert boundaries for future prediction,
  platform observation, terminal, storage, and Ollama work.
- Frontend interaction tests and Rust unit tests.
- Multi-platform CI and tag-triggered desktop release workflow.

## Not Implemented Yet

Bloom `v0.1.0-alpha.1` does not monitor real apps, install terminal hooks, call
Ollama, persist activity, open URLs, launch apps, execute commands, collect
browser history, or run autonomous workflows.

Those capabilities are planned later and must remain local, explainable,
optional, and user-confirmed.

## Install The Alpha

Download the latest prerelease from
[GitHub Releases](https://github.com/vivaanseth/bloom/releases).

Artifacts are unsigned in the alpha line. macOS Gatekeeper and Windows
SmartScreen may warn before opening the app. Verify the artifact against the
published `SHASUMS256.txt` checksum before running it.

Runtime support is currently verified only on the development macOS machine.
Windows and Linux artifacts are CI-built alpha artifacts until they receive
manual runtime testing.

## Development

Install dependencies:

```bash
npm install
```

Run the browser preview:

```bash
npm run dev
```

Run the Tauri desktop app:

```bash
npm run tauri -- dev
```

The browser preview defaults to the dashboard. Use `/?surface=companion` or
`/?surface=dashboard` to view a specific surface outside Tauri.

## Verification

Use the checks below before reporting work as complete:

```bash
npm run typecheck
npm run test
npm run lint
npm run scan:privacy
npm run build
cargo fmt --check --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --all-features -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
npm run tauri:build:no-bundle
npm run tauri:build
```

`npm run tauri:build:no-bundle` is the fast shell build. `npm run tauri:build`
creates desktop bundles for the current operating system.

## Privacy Status

This milestone uses synthetic data only. Feedback and Pause Learning state are
kept in memory and reset when the app restarts. No telemetry is enabled. No
screen recording, screenshots, global keyboard monitoring, clipboard history,
browser history, terminal history, private messages, secrets, or environment
variables are collected.

## Platform Notes

Bloom is designed for macOS, Windows, and Linux. The current implementation has
been compiled and tested locally on macOS only. Linux tray and transparency
behavior varies by desktop environment. macOS transparent windows are configured
through Tauri and should not be treated as a Mac App Store distribution claim.

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE))
- MIT license ([LICENSE-MIT](LICENSE-MIT))

at your option.
