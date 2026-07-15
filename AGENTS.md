# AGENTS.md

## Project Overview

This repository contains a cross-platform desktop companion for macOS, Windows, and Linux.

The companion is represented by a small animated character. It privately learns limited patterns in how the user works and offers useful next-action suggestions.

Examples:

* Correct `git int` to `git init`.
* Suggest opening an application the user commonly opens next.
* Suggest an approved development command such as `npm run dev`.
* Offer a saved routine containing several registered actions.

The application is not a general-purpose chatbot, autonomous computer agent, screen recorder, employee-monitoring system, or cloud service.

## Required Technology

Use:

* Tauri 2
* React
* TypeScript
* Vite
* Rust
* SQLite
* Local application storage
* Optional Ollama integration

The project must be designed for:

* macOS
* Windows
* Linux

Do not replace this stack without explicit approval.

## Core Engineering Principles

### 1. Local-first

The application must work without:

* an account
* a cloud backend
* an internet connection
* Ollama
* a downloaded language model

Ollama is an optional enhancement only.

### 2. Suggest, never assume

The application may suggest actions, but must never execute them automatically.

Every executable suggestion must:

1. Identify the exact action.
2. Show the user what will happen.
3. Require an explicit click or keyboard confirmation.
4. Pass through the registered action validator.
5. Be recorded in the local suggestion history.

### 3. No arbitrary model execution

Never execute raw shell commands returned by:

* Ollama
* another language model
* frontend input
* unvalidated IPC data
* prediction output

Models may only choose from existing registered action identifiers.

All action arguments must be validated independently of the model.

### 4. Privacy by architecture

Do not implement:

* screen recording
* screenshots
* global keylogging
* clipboard history
* password collection
* browser-message inspection
* private-message inspection
* environment-variable collection
* storage of secrets, tokens, passwords, or API keys
* hidden background monitoring
* telemetry or analytics enabled by default

Use explicit integrations and the minimum data required for predictions.

### 5. Platform isolation

Keep operating-system-specific code behind shared Rust interfaces.

Use this structure:

```text
src-tauri/src/platform/
├── mod.rs
├── macos.rs
├── windows.rs
└── linux.rs
```

Do not scatter platform conditionals throughout unrelated modules.

Use runtime capability detection when operating-system behavior may vary.

### 6. Small focused modules

Do not create large files containing unrelated responsibilities.

Keep separate modules for:

* UI
* platform observation
* persistence
* prediction
* suggestion ranking
* feedback
* registered actions
* validation
* terminal integration
* privacy filtering
* Ollama
* settings

Split files when they become difficult to understand or test.

### 7. Honest feature support

Never claim that a platform feature works unless it has been implemented and tested.

Use status labels such as:

* Supported
* Beta
* Experimental
* Unavailable

The UI and README must explain limitations clearly.

## Current Architecture

Frontend responsibilities:

```text
src/
├── app/
├── components/
├── features/
│   ├── companion/
│   ├── suggestions/
│   ├── activity/
│   ├── routines/
│   └── settings/
├── hooks/
├── services/
├── stores/
├── styles/
└── types/
```

Rust responsibilities:

```text
src-tauri/src/
├── lib.rs
├── commands/
├── models/
├── storage/
├── prediction/
├── suggestions/
├── actions/
├── privacy/
├── ollama/
├── platform/
└── terminal/
```

Do not move core security, validation, prediction, or platform behavior into the React frontend.

## State Ownership

The Rust backend owns:

* recorded events
* learned transitions
* prediction scores
* suggestion history
* registered actions
* action validation
* privacy filtering
* platform capability information
* Ollama availability
* local persistence

The React frontend owns:

* visual state
* open or closed panels
* animation state
* selected settings section
* temporary form state
* loading and error presentation

The frontend must not be treated as a security boundary.

## Prediction Rules

The first prediction system should use explainable techniques:

* fuzzy string matching
* edit distance
* prefix similarity
* command frequency
* app-transition frequency
* recent sequence context
* time-of-day buckets
* weekday context
* acceptance rate
* dismissal rate
* recency weighting
* cooldowns
* minimum observation thresholds

Do not introduce a neural network during the initial milestones.

Every suggestion should be explainable using structured factors.

Example:

```text
Suggested because:
- Edge was opened.
- ChatGPT followed Edge 8 of the last 10 times.
- This pattern commonly occurs during the afternoon.
```

## Registered Actions

All executable behavior must use registered actions.

Conceptual model:

```rust
pub enum RegisteredAction {
    OpenApplication {
        identifier: String,
    },
    OpenUrl {
        url: String,
    },
    RunApprovedCommand {
        command_id: String,
        arguments: Vec<String>,
    },
    LaunchRoutine {
        routine_id: String,
    },
}
```

Requirements:

* Validate identifiers and arguments.
* Restrict URL schemes.
* Require confirmation.
* Reject unknown action types.
* Reject unregistered command identifiers.
* Reject unsafe or destructive commands.
* Log the result without storing secrets.
* Never accept raw shell command strings directly from Ollama.

## Terminal Integration Rules

Terminal support must use explicit user-installed integrations.

Supported future integrations:

```text
terminal-integrations/
├── shared/
├── zsh/
├── bash/
└── powershell/
```

Do not globally monitor typing.

Terminal integrations may provide:

* current command
* failed command
* current working directory
* shell type
* exit status

Do not store full terminal history by default.

Redact or discard commands that may contain:

* passwords
* tokens
* secrets
* API keys
* authorization headers
* private keys
* environment-variable values

Do not suggest destructive commands such as unbounded recursive deletion, disk formatting, destructive Git resets, or privilege escalation.

## Ollama Rules

Ollama must be:

* optional
* disabled by default
* localhost-only
* replaceable with a template-based implementation
* guarded by timeouts
* cancellable
* isolated behind a service interface

Ollama may only:

* rephrase an existing suggestion
* explain a known command
* summarize aggregate habit information
* match natural language to an existing routine
* generate short non-executable character dialogue

Ollama must not:

* create unrestricted actions
* execute commands
* receive raw terminal history
* receive file contents by default
* receive private browser data
* receive passwords or secrets
* decide whether an action is safe

Always fall back gracefully when Ollama is unavailable.

## User Experience Rules

The companion should feel:

* helpful
* calm
* lightweight
* private
* friendly
* unobtrusive

Avoid:

* excessive notifications
* constant speech bubbles
* fake system warnings
* manipulative language
* guilt for dismissing suggestions
* large chatbot interfaces
* cyberpunk “hacker” styling
* noisy animations

Every suggestion must support:

* Accept
* Dismiss
* Snooze
* Disable this suggestion
* Why am I seeing this?

Use cooldowns and interruption limits.

## Accessibility

All important actions must be available through:

* pointer controls
* keyboard controls
* accessible labels

Do not rely on animation alone to communicate state.

Respect reduced-motion preferences.

Use sufficient contrast and semantic HTML.

## Documentation Rules

Update documentation whenever behavior changes.

Important files:

* `PRODUCT.md`
* `ARCHITECTURE.md`
* `PRIVACY.md`
* `ROADMAP.md`
* `README.md`

Do not document planned functionality as completed functionality.

## Dependency Rules

Before adding a dependency:

1. Explain why it is needed.
2. Check whether the existing stack already provides the capability.
3. Prefer maintained and narrowly scoped packages.
4. Avoid adding a large dependency for a small feature.
5. Consider macOS, Windows, and Linux compatibility.
6. Check licensing compatibility.
7. Add tests around the boundary it introduces.

Do not add animation frameworks during the first visual milestone unless CSS cannot reasonably provide the required behavior.

## Testing Requirements

Add tests for non-trivial logic.

Required categories:

* fuzzy command ranking
* prediction scoring
* confidence thresholds
* cooldown behavior
* acceptance and dismissal weighting
* privacy redaction
* action validation
* registered action lookup
* Ollama fallback behavior
* platform capability handling

Use synthetic data only.

Tests must not require:

* Ollama
* a downloaded model
* internet access
* real user activity data
* a specific desktop environment

## Validation Before Completing Work

Before reporting a task as complete, run all applicable checks:

```bash
npm run typecheck
npm run test
npm run lint
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
npm run tauri build
```

Use the actual scripts available in the repository if they differ.

Report honestly:

* passed checks
* failed checks
* skipped checks
* warnings
* platform limitations
* manual testing performed

Do not claim that Windows or Linux behavior was tested merely because it compiled in CI.

## Change Discipline

Before editing:

1. Read `PRODUCT.md`.
2. Read `ARCHITECTURE.md`.
3. Read `PRIVACY.md`.
4. Read `ROADMAP.md`.
5. Identify the current milestone.
6. Inspect the existing implementation.
7. State the files that need to change.

During implementation:

* Work only on the requested milestone.
* Do not add future features “while already there.”
* Preserve existing behavior unless the task explicitly changes it.
* Keep changes reviewable.
* Add or update tests alongside behavior.

After implementation:

1. Run verification.
2. Summarize changed files.
3. Explain important design decisions.
4. Identify remaining limitations.
5. Stop before beginning another milestone.

## Current Milestone

The first implementation milestone contains only:

* Tauri application shell
* system tray item
* transparent floating companion window
* placeholder animated character
* mock suggestion bubble
* Accept control
* Dismiss control
* Snooze control
* normal dashboard or settings window
* placeholder activity view using synthetic data
* Pause Learning toggle
* platform capability display
* frontend interaction tests
* Rust model and action-validation tests

The first milestone must not contain:

* real application monitoring
* terminal hooks
* browser tracking
* Ollama calls
* command execution
* automatic application launching
* real activity persistence
* neural networks
* invasive operating-system permissions