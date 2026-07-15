ROADMAP.md

Current implementation status:

Milestone 0 and Milestone 1 are implemented as an initial foundation and visual
shell. The app uses synthetic activity and in-memory state only. Real
observation, terminal hooks, persistence, registered action execution, and
Ollama remain deferred to later milestones.

`v0.1.0-alpha.1` is a public desktop app-shell alpha. It is not the completed
assistant described by the later milestones.

Roadmap Principles
Build shared architecture before platform-specific features.
Complete one milestone at a time.
Keep every milestone testable.
Do not claim platform support before real testing.
Keep Ollama optional.
Avoid invasive permissions.
Prefer a smaller reliable release over a large unfinished assistant.
Milestone 0: Repository Foundation

Goals:

Scaffold Tauri 2 with React, TypeScript, Vite, and Rust.
Establish frontend and Rust module boundaries.
Add project documentation.
Add testing configuration.
Add formatting and linting.
Add multi-platform GitHub Actions.
Add initial issue and pull-request templates.

Completion criteria:

Frontend type checking passes.
Frontend tests run.
Rust formatting passes.
Rust linting passes.
Rust tests run.
The Tauri shell builds on the current development machine.
CI is configured for macOS, Windows, and Ubuntu.
Public repository hygiene files exist.
Milestone 1: Visual Companion Shell

Goals:

System tray item
Transparent bottom-right corner companion window
Placeholder SVG character
Idle animation
Suggestion animation
Mock suggestion speech bubble
Accept
Dismiss
Snooze
Dashboard window
Settings view
Placeholder Activity view
Pause Learning toggle
Platform capability display
Reduced-motion handling

No real observation or action execution.

Completion criteria:

Character can be shown and hidden.
Suggestion interactions work.
Tray controls work on the development platform.
Dashboard opens reliably.
UI has keyboard-accessible controls.
Tests cover suggestion interaction state.
Unsupported capabilities display clearly.
Milestone 2: Shared Prediction Engine

Goals:

Define activity-event models.
Define prediction context.
Define candidate scoring.
Add transition-frequency prediction.
Add time and weekday weighting.
Add feedback adjustment.
Add cooldowns.
Add confidence thresholds.
Add explanation generation.
Use synthetic data only.

No operating-system monitoring.

Completion criteria:

Prediction tests use deterministic fixtures.
Repeated patterns produce expected rankings.
Dismissals reduce scores.
Cooldowns suppress repeated suggestions.
Every suggestion includes an explanation.
Prediction never executes actions.
Milestone 3: Local Persistence

Goals:

Add SQLite.
Add migrations.
Store settings.
Store synthetic or manually created events.
Store suggestion feedback.
Add retention behavior.
Add Activity deletion controls.
Add Delete All Learned Data.

Completion criteria:

Migrations run on a clean database.
Data survives restart.
Deletion removes expected records.
Privacy filtering occurs before persistence.
Tests cover migrations and deletion.
Milestone 4: macOS Application Observation

Goals:

Implement macOS platform adapter.
Observe application activation using appropriate APIs.
Record only application identifiers and timestamps.
Feed events into the shared predictor.
Show real suggestions after minimum thresholds.
Add permission and capability documentation.

Completion criteria:

Tested on an Intel or Apple Silicon Mac.
No screen-recording permission required.
Learning can be paused.
Activity can be inspected and deleted.
Suggestions require confirmation.
Milestone 5: Windows Application Observation

Goals:

Implement Windows adapter.
Observe foreground application changes.
Identify applications without recording window text by default.
Feed events into the same shared predictor.
Document Windows-specific behavior.

Completion criteria:

Tested on a real Windows machine.
No code injection.
No global keyboard monitoring.
Capability status is accurate.
Existing macOS behavior remains unchanged.
Milestone 6: Linux Application Observation

Goals:

Implement Linux capability detection.
Separate X11 and Wayland behavior where necessary.
Support application observation only where safely available.
Clearly report desktop-environment limitations.

Completion criteria:

Tested on at least one real Linux environment.
Unsupported environments degrade gracefully.
No invasive fallback.
README support matrix is updated honestly.
Milestone 7: Registered Action System

Goals:

Add action registry.
Add validation.
Add action preview.
Add confirmation state.
Add application launching.
Add approved URL opening.
Add routine execution framework.
Add result history.

Completion criteria:

Unknown actions are rejected.
Unsafe URL schemes are rejected.
Actions never execute without confirmation.
Frontend cannot bypass validation.
Tests cover validation and failures.
Milestone 8: Terminal Correction

Goals:

Add shared shell-integration protocol.
Add zsh integration.
Add bash integration.
Add PowerShell integration.
Receive failed or explicitly submitted commands.
Add Git command dictionary.
Add common shell command dictionary.
Detect package scripts.
Add fuzzy correction.
Add privacy redaction.
Add safe-command filtering.

Completion criteria:

No global keylogging.
Shell integrations are explicitly installed.
Commands containing likely secrets are discarded or redacted.
Suggestions show exact commands.
Execution requires confirmation.
Destructive suggestions are blocked.
Milestone 9: Learned Routines

Goals:

Create routines manually.
Detect repeated action sequences.
Suggest saving repeated sequences as routines.
Add routine editing.
Add routine enable and disable controls.
Explain why a routine was suggested.

Completion criteria:

Routine actions are registered and validated.
Users can edit before saving.
Routines never launch automatically.
Repeated dismissals suppress routine suggestions.
Milestone 10: Optional Ollama

Goals:

Add TemplateLanguageService.
Add OllamaLanguageService.
Detect local Ollama availability.
Add model configuration.
Add connection testing.
Rephrase existing suggestions.
Explain known commands.
Summarize aggregate patterns.
Match natural language to registered actions.
Add strict timeouts and fallback.

Completion criteria:

App remains fully usable without Ollama.
Tests use a mock client.
No test requires a real model.
Ollama cannot create arbitrary actions.
Only localhost communication is used.
Settings explain what information is sent.
Milestone 11: Release Preparation

Goals:

Finalize project name and branding. Completed for the alpha as Bloom.
Add README screenshots and demonstration GIF.
Add installation instructions.
Add platform support matrix.
Add CONTRIBUTING.md. Completed for the alpha.
Add SECURITY.md. Completed for the alpha.
Choose an open-source license. Completed as MIT OR Apache-2.0.
Build signed or unsigned development packages as appropriate.
Create GitHub release workflows. Completed for alpha prerelease builds.
Produce macOS, Windows, and Linux artifacts.

Possible formats:

macOS: DMG or application bundle
Windows: NSIS installer
Linux: AppImage and/or Debian package

Completion criteria:

Release artifacts are generated through documented workflows.
Limitations are clearly stated.
Privacy documentation matches behavior.
Installation and uninstall instructions are tested.
Alpha release notes describe only completed features.
Stable v0.1.0 release notes describe only completed features.
Future Possibilities

Not part of the initial release:

Optional browser extension
More shell integrations
Plugin API
Multiple character themes
Local model provider adapters beyond Ollama
Importable routine packs
Advanced on-device classifiers
Voice control
Sync

Future features must preserve the core promise:

Local, explainable, optional, and always user-controlled.
