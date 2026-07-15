# PRODUCT.md

## Product Identity

The product name is Bloom.

Release-facing identifiers:

* GitHub repository: `vivaanseth/bloom`
* Package name: `bloom`
* Application identifier: `io.github.vivaanseth.bloom`

## Product Summary

This product is a small cross-platform desktop companion represented by an animated character.

It privately learns limited patterns in how the user works and offers helpful next-action suggestions.

It is designed for macOS, Windows, and Linux.

The companion does not attempt to control the computer autonomously. It observes approved signals, predicts a likely helpful action, explains the suggestion, and waits for the user to accept or dismiss it.

## One-Sentence Description

A private desktop companion that learns your routines and suggests the next useful action before you ask.

## Product Principles

### Local first

Core functionality runs entirely on the user’s computer.

No account or cloud backend is required.

### Helpful, not autonomous

The application suggests actions. The user remains in control.

### Predictive, not conversational

The primary interface is a character and small suggestion speech bubbles, not a full chatbot window.

### Explainable

Users should understand why a suggestion appeared.

### Private by default

The application collects the smallest amount of information required and allows users to inspect or delete it.

### Cross-platform

The shared product should work across macOS, Windows, and Linux while honestly communicating platform-specific limitations.

### Useful without an LLM

Rules, fuzzy matching, sequence prediction, and feedback learning provide the core experience.

Ollama is optional.

## Target Users

### Primary users

* Developers
* Students
* Technical creators
* People who repeatedly open the same applications or project setup
* Users who prefer keyboard-driven workflows
* Privacy-conscious users interested in local software

### Secondary users

* People who want lightweight routine automation
* People who want an animated desktop companion
* Users learning terminal commands
* People who want contextual reminders without using cloud AI

## Core User Problems

### Repetitive setup

Users repeatedly open the same applications, websites, projects, and development tools.

### Small terminal mistakes

Users mistype commands or partially remember command names.

### Workflow interruption

Users forget what they usually do after opening a project or application.

### Existing assistants feel excessive

Many assistants require cloud accounts, send data externally, or present a large chatbot interface for small actions.

### Automation can feel unsafe

Users may not trust software that performs actions without clearly asking first.

## Core Experience

The companion is available from the system tray and can display a small floating character near the bottom-right corner of the screen.

The character remains quiet most of the time.

When the application has a sufficiently confident and useful suggestion, the character pops out from its corner dock and shows a compact speech bubble.

Example:

```text
Did you mean `git init`?

[Run] [Edit] [Dismiss]
```

Another example:

```text
You usually open ChatGPT after Edge in the afternoon.

[Open ChatGPT] [Not now]
```

Another example:

```text
You usually start the development server after opening this project.

[Run npm run dev] [Dismiss]
```

The user can:

* accept the suggestion
* dismiss it
* snooze suggestions
* disable that suggestion type
* ask why it appeared
* pause all learning
* inspect learned activity
* erase all learned data

## Main Product Systems

### Character interface

The animated character represents application states:

* Idle
* Observing
* Suggestion available
* Waiting for confirmation
* Performing an approved action
* Success
* Error
* Snoozed
* Learning paused

The character should be visually polished but must not distract from normal computer use.

### Suggestion engine

The suggestion engine generates candidates from:

* command corrections
* application transitions
* recurring action sequences
* time-of-day patterns
* weekday patterns
* saved routines
* recently accepted suggestions

It ranks candidates and shows only those that pass safety, relevance, confidence, and cooldown checks.

### Terminal correction

An explicit shell integration may send a command or failed command to the application.

The application can suggest a correction based on:

* known shell commands
* Git subcommands
* package scripts
* fuzzy similarity
* project context
* previous accepted corrections

The application must never act as a global keylogger.

### Routine prediction

The application can learn repeated sequences such as:

```text
Open browser
→ Open ChatGPT
→ Open Instagram
```

or:

```text
Open project
→ Open terminal
→ Run development server
```

The first prediction system should use frequency-based and weighted scoring rather than a neural network.

### Registered actions

Every executable suggestion maps to a registered action.

Examples:

* Open an installed application
* Open an approved URL
* Run an approved command
* Launch a saved routine

Unknown actions must be rejected.

### Optional Ollama integration

Ollama may make the companion feel more natural, but it is not required.

When enabled, Ollama may:

* rephrase suggestions
* explain known commands
* summarize learned aggregate patterns
* identify a saved routine from natural language
* generate short character dialogue

Ollama cannot directly execute actions.

## Public Releases

### Current alpha: `v0.1.0-alpha.1`

The first public alpha is intentionally limited to the app shell and visual
companion experience.

Implemented in the alpha:

* Cross-platform Tauri application shell
* System tray integration
* Floating animated companion
* Dashboard and settings shell
* Mock suggestion speech bubble interactions
* Pause Learning state for the current process
* Synthetic activity viewer
* Platform capability display
* Documentation and tests

Not implemented in the alpha:

* Real application monitoring
* Terminal hooks
* SQLite persistence
* Registered action execution
* Application or URL launching
* Ollama requests
* Automatic suggestions based on real behavior

### Planned stable `v0.1.0` features

The first stable release should complete the documented assistant scope:

* Cross-platform Tauri application
* System tray integration
* Floating animated companion
* Dashboard and settings
* Suggestion speech bubble interactions
* Pause Learning
* Local activity viewer
* Delete All Learned Data
* Application-sequence learning on supported platforms
* Simple explainable prediction scoring
* Accept, dismiss, ignore, and snooze feedback
* Basic terminal command correction
* Registered action validation
* Optional Ollama rephrasing or command explanation
* Platform capability display
### Not required for stable `v0.1.0`

* Browser extension
* Website-history tracking
* Voice input
* Screen understanding
* Screenshots
* Global keyboard monitoring
* Cloud sync
* Accounts
* Mobile application
* Plugin marketplace
* Autonomous workflows
* Neural networks
* Full natural-language computer control
* Automatic execution
* Employee or productivity monitoring

## Suggestion Quality Rules

Do not show a suggestion merely because it is possible.

A suggestion should generally require:

* enough observations
* sufficient confidence
* current context match
* no recent dismissal pattern
* no active cooldown
* a safe registered action
* a meaningful reduction in user effort

The system should favor silence over low-quality interruptions.

## Prediction Inputs

Allowed initial prediction inputs include:

* current application identifier
* previous application identifier
* short sequence of application identifiers
* weekday
* broad time-of-day bucket
* current project identifier when explicitly provided
* terminal command category
* current working directory when sent by a shell integration
* prior suggestion acceptance and dismissal rates
* time since the previous event

Avoid storing window titles, document names, typed content, or browser page contents.

## Example Prediction Score

The exact formula may evolve, but it should remain explainable.

Conceptual model:

```text
score =
    transition frequency
  × context match
  × time match
  × recency weight
  × acceptance adjustment
  × safety adjustment
```

A suggestion should not appear before meeting a minimum observation threshold.

## Feedback Behavior

### Accepted

* Increase the suggestion’s weight.
* Record successful completion when available.
* Keep normal cooldowns.

### Dismissed

* Reduce its weight.
* Avoid showing it again immediately.
* Suppress it in that context after repeated dismissals.

### Ignored

* Apply a smaller negative adjustment.
* Do not assume intentional rejection immediately.

### Disabled

* Never show that suggestion type or rule again unless re-enabled.

### Snoozed

* Temporarily suppress suggestions according to the selected duration.

## User Controls

Settings should eventually include:

### General

* Launch at startup
* Show floating character
* Character position
* Animation level
* Reduced motion
* Notification intensity

### Learning

* Pause Learning
* Minimum confidence
* Suggestion frequency
* Raw event retention period
* View learned activity
* Delete all learned data

### Terminal

* Install or remove shell integration
* Enable command correction
* Store accepted correction frequencies
* Show exact command before running

### Ollama

* Enable Ollama
* Local service status
* Model name
* Test connection
* Maximum response time
* Allowed Ollama features
* Explanation of information sent

### Privacy

* Recorded data categories
* Retention controls
* Export local data
* Delete all data
* Platform permissions

## Character Design Direction

The character should be:

* small
* recognizable at low sizes
* friendly
* modern
* expressive through subtle movement
* suitable for light and dark backgrounds

The design should not feel:

* childish
* overly robotic
* like a generic chatbot logo
* visually noisy
* constantly attention-seeking

Initial implementation may use a lightweight local SVG with CSS animation.

Do not block development on final character artwork.

## Window Model

The application should have:

### Floating companion window

* Transparent background
* Compact size
* Always-on-top option
* Click-through behavior when appropriate
* Suggestion speech bubble attachment
* Draggable position
* Multi-monitor awareness
* Reduced-motion support

### Dashboard window

Contains:

* Activity
* Suggestions
* Routines
* Platform support
* Settings
* Privacy controls
* Ollama status

### System tray

Contains:

* Show Companion
* Open Dashboard
* Pause or Resume Learning
* Snooze Suggestions
* Ollama status
* Quit

## Cross-Platform Expectations

The product should provide a shared experience, but underlying capabilities may vary.

### macOS

Expected eventual support:

* application activation observation
* zsh and bash integration
* tray
* transparent companion window
* app and URL launching

### Windows

Expected eventual support:

* foreground application observation
* PowerShell integration
* tray
* transparent companion window
* app and URL launching

### Linux

Expected eventual support:

* tray where supported
* bash and zsh integration
* application observation where the desktop environment permits it
* capability detection for X11 and Wayland differences
* transparent companion window where supported

Linux limitations must be shown clearly rather than hidden.

## Success Criteria

The product is successful when:

* users understand what it does without a long tutorial
* the companion remains quiet until it has a useful suggestion
* users can safely accept suggestions in one action
* users understand why suggestions appear
* users can inspect and delete learned information
* the application works without Ollama
* Ollama failures do not break the application
* no arbitrary model-generated commands can execute
* platform limitations are reported honestly
* the repository is understandable to outside contributors

## GitHub Project Goals

The repository should demonstrate:

* cross-platform desktop development
* Rust and TypeScript architecture
* local-first product design
* privacy engineering
* explainable prediction systems
* safe command execution
* optional local language-model integration
* thoughtful user experience
* automated testing
* multi-platform CI

The project should be impressive because of its architecture and restraint, not because it claims to control everything.
