The application uses Tauri 2 with a React and TypeScript frontend and a Rust backend.

The architecture separates interface code from trusted backend logic.

React interface
      ↓
Typed Tauri commands and events
      ↓
Rust application services
      ↓
Prediction, storage and validation
      ↓
Platform-specific adapters

The frontend is not a security boundary.

All sensitive actions, validation, persistence, privacy filtering, and platform access must occur in Rust.

Major Components
Frontend

Responsibilities:

render the companion
animate character states
display suggestion speech bubbles
collect explicit user actions
show activity and settings
display capability information
display Ollama state
present errors

The frontend must not:

execute shell commands
directly access SQLite
choose whether actions are safe
inspect operating-system activity directly
bypass Rust validation
Tauri command layer

Provides typed communication between the frontend and Rust.

Example command categories:

get_platform_capabilities
get_settings
update_settings
list_suggestions
respond_to_suggestion
list_activity
delete_activity
pause_learning
get_ollama_status
test_ollama_connection

Commands should use serializable request and response models.

Do not expose a generic “execute command” endpoint.

Event system

Rust may emit frontend events such as:

suggestion-created
suggestion-updated
suggestion-dismissed
learning-state-changed
platform-capabilities-changed
ollama-status-changed

Events should carry identifiers and structured data rather than executable code.

Rust Modules
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
Models

Contains shared value types:

ActivityEvent
ApplicationInfo
Suggestion
SuggestionCandidate
SuggestionFeedback
PredictionContext
PredictionExplanation
RegisteredAction
Routine
PlatformCapabilities
OllamaStatus
AppSettings

Models should avoid platform-specific native types.

Storage

Responsible for:

opening and migrating SQLite
event retention
aggregate transition storage
suggestion history
feedback
routines
settings

No UI logic belongs in storage.

Suggested tables:

events
transitions
suggestions
suggestion_feedback
routines
routine_actions
settings
schema_migrations

Store raw events temporarily and retain aggregate information longer.

Prediction

Responsible for:

candidate generation
fuzzy matching
transition frequency
context matching
recency weighting
acceptance adjustment
dismissal adjustment
minimum observation requirements
confidence calculation

Prediction code must not execute actions.

Conceptual interface:

pub trait Predictor {
    fn predict(
        &self,
        context: &PredictionContext,
    ) -> Result<Vec<SuggestionCandidate>, PredictionError>;
}
Suggestions

Responsible for:

ranking candidates
enforcing confidence thresholds
cooldowns
duplicate suppression
interruption limits
building explanations
emitting approved suggestions to the frontend
Actions

Responsible for:

registered action lookup
validation
confirmation state
platform execution
safe failure handling
result logging

Conceptual flow:

Suggestion accepted
→ registered action loaded
→ arguments validated
→ action preview confirmed
→ platform executor called
→ result recorded
Privacy

Responsible for:

secret detection
redaction
retention rules
allowed data categories
event rejection
export preparation
deletion

Privacy filtering should occur before persistence.

Ollama

Provide an abstraction:

pub trait LanguageService {
    fn is_available(&self) -> bool;

    fn rephrase_suggestion(
        &self,
        input: RephraseRequest,
    ) -> Result<String, LanguageError>;

    fn explain_command(
        &self,
        input: CommandExplanationRequest,
    ) -> Result<String, LanguageError>;

    fn match_registered_action(
        &self,
        input: ActionMatchRequest,
    ) -> Result<Option<String>, LanguageError>;
}

Implementations:

TemplateLanguageService
OllamaLanguageService
MockLanguageService

The template implementation is always available.

Any action identifier returned by Ollama must be resolved against the registered action store.

Platform

Shared interface:

pub trait PlatformObserver {
    fn capabilities(&self) -> PlatformCapabilities;

    fn start(&mut self) -> Result<(), PlatformError>;

    fn stop(&mut self) -> Result<(), PlatformError>;

    fn active_application(
        &self,
    ) -> Result<Option<ApplicationInfo>, PlatformError>;
}

Separate implementations:

platform/
├── mod.rs
├── macos.rs
├── windows.rs
└── linux.rs

Platform modules may use conditional compilation internally.

Other modules should depend on the shared interface.

Terminal

Responsible for:

explicit shell integration communication
input schema validation
command parsing
fuzzy correction
project-script discovery
privacy filtering
safe suggestion creation

Planned integrations:

terminal-integrations/
├── shared/
├── zsh/
├── bash/
└── powershell/

Shell integrations should communicate through a narrow local interface.

Do not expose an unauthenticated network server.

Platform Capability Model

The application must detect capabilities rather than assume them.

Example:

pub struct PlatformCapabilities {
    pub application_observation: CapabilityState,
    pub terminal_integration: CapabilityState,
    pub transparent_window: CapabilityState,
    pub system_tray: CapabilityState,
    pub autostart: CapabilityState,
}

Possible states:

Supported
PermissionRequired
Unavailable
Experimental
Error

The dashboard should explain unavailable features.

Data Flow: Application Pattern
Operating-system adapter
→ application activation event
→ privacy filter
→ temporary local event
→ aggregate transition update
→ predictor evaluates context
→ suggestion passes confidence and cooldown rules
→ frontend displays suggestion
→ user accepts or dismisses
→ feedback updates local weights
Data Flow: Terminal Correction
Explicit shell hook
→ command and working directory
→ privacy filter
→ command dictionary and project scripts
→ fuzzy candidate ranking
→ safe-command filter
→ suggestion speech bubble
→ user confirmation
→ registered action execution
Data Flow: Optional Ollama
Approved suggestion data
→ minimum-context serializer
→ localhost Ollama client
→ short generated wording
→ output length and content validation
→ displayed suggestion text

The original registered action remains unchanged.

If Ollama fails:

Ollama failure
→ template wording
→ normal application behavior continues
Database Guidance

Use migrations from the beginning.

Do not make development schema changes directly without migrations.

Avoid storing:

application window titles
browser page titles
complete URLs from browsing activity
terminal output
terminal history
environment variables
secrets
file contents

Use synthetic fixtures for tests.

Error Handling

Use structured error types.

Do not expose internal panic information directly to the user.

User-facing errors should explain:

what failed
whether the feature remains available
whether user action is required

The application must recover gracefully from:

missing Ollama
corrupt optional model configuration
unsupported desktop environment
unavailable tray behavior
denied permissions
database migration failure
shell integration disconnect
unknown registered action
Security Boundaries

Trusted:

Rust validation
action registry
privacy filter
local persistence layer
platform adapters

Untrusted or semi-trusted:

frontend request data
shell integration messages
Ollama output
imported routines
local IPC inputs

All untrusted data must be validated.

Testing Strategy
Rust unit tests
prediction factors
candidate ranking
feedback weighting
cooldowns
privacy redaction
action validation
URL scheme rules
Ollama fallback
platform capability behavior
Frontend tests
suggestion interactions
settings controls
paused-learning presentation
capability warnings
Ollama status presentation
keyboard accessibility
Integration tests
typed frontend-to-Rust commands
storage migrations
suggestion feedback flow
registered action resolution
CI

Run checks on:

macOS
Windows
Ubuntu

Current Implementation Snapshot

The repository currently contains the Milestone 0 and Milestone 1 shell:

Frontend:

src/app selects the companion or dashboard surface.
src/features/companion renders the transparent companion window.
src/features/suggestions renders the mock suggestion and feedback controls.
src/features/activity renders synthetic activity.
src/features/settings renders Pause Learning and platform capability views.
src/services/companionApi owns Tauri command calls and browser-preview fallbacks.

Rust:

src-tauri/src/models contains serializable command, suggestion, capability, and
prediction contract types.
src-tauri/src/actions validates registered actions but does not execute them.
src-tauri/src/commands exposes the current typed Tauri commands.
src-tauri/src/platform reports capability status through isolated platform
modules.
src-tauri/src/suggestions provides synthetic activity and the mock suggestion.
src-tauri/src/state stores only in-memory session state.
src-tauri/src/tray builds the system tray menu.

The following modules are present as inert boundaries for later milestones:
storage, prediction, privacy, terminal, and ollama. They must not be treated as
completed feature implementations.

Compilation does not count as complete platform behavior testing.
