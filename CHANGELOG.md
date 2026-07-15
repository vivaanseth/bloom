# Changelog

All notable changes to Bloom will be documented in this file.

## 0.1.0-alpha.1 - 2026-07-14

### Added

- First public app-shell alpha for Bloom.
- Tauri desktop app with floating companion and dashboard windows.
- System tray controls for companion visibility, dashboard opening, learning
  pause/resume, and quit.
- CSS/SVG desk-spirit companion and mock suggestion speech bubble.
- Synthetic activity view, platform capability labels, and in-memory feedback.
- Rust model, validation, privacy, prediction, storage, terminal, and Ollama
  module boundaries for later milestones.
- Multi-platform CI and tag-triggered desktop release workflow.

### Security And Privacy

- The alpha stores no durable activity data and performs no real observation.
- No telemetry, analytics, browser history, screenshots, terminal hooks, Ollama
  calls, command execution, URL opening, or application launching are enabled.

### Release Notes

- Artifacts are unsigned prerelease builds. Operating systems may show trust
  warnings until signing and notarization are added.
