Privacy Promise

The application is local-first and designed to collect the minimum information required to provide suggestions.

Core functionality requires no account, cloud backend, or internet connection.

Optional Ollama integration communicates only with a local Ollama service.

Data the Application May Store

Depending on enabled features:

application bundle identifier or executable identifier
event timestamp
previous application identifier
broad time-of-day bucket
weekday
registered action identifier
suggestion confidence
whether a suggestion was accepted, dismissed, ignored, or snoozed
aggregate transition counts
saved routine definitions
application settings
accepted command-correction frequencies
Data the Application Must Not Store
screenshots
screen recordings
global keystrokes
passwords
authentication tokens
API keys
private keys
environment-variable values
private messages
email contents
browser-message contents
terminal output
complete terminal history
clipboard history
file contents by default
hidden background recordings
employee-performance metrics
Application Observation

Application observation should record only stable application identifiers and timestamps.

Do not record window titles by default.

Do not record filenames or document names from active windows.

Do not use screen recording to identify applications.

Terminal Integration

Terminal integration must be explicitly installed by the user.

It may send:

current command or failed command
current working directory
shell type
exit status

Commands should be filtered before storage or suggestion processing.

Commands containing likely secrets must be discarded or redacted.

Do not store full shell history by default.

Browser Information

The initial product must not collect browser history.

Opening a URL through a registered action may be recorded as an accepted action identifier.

A future browser extension must be:

optional
separately documented
limited to minimum necessary domain-level information
disabled by default
Ollama

Ollama integration is optional and disabled by default.

The application may send Ollama only the minimum context needed for an enabled feature.

Allowed examples:

Rephrase:
“You usually open ChatGPT after Edge.”
Explain:
“git init”
Choose from registered routines:
- luminal-development
- homework
- after-school-browsing

Do not send:

raw terminal history
passwords
tokens
file contents
private messages
browser history
screenshots
environment variables

Ollama output is not trusted for action execution.

User Controls

Users must be able to:

pause learning
resume learning
snooze suggestions
inspect recorded activity
inspect aggregate patterns
disable individual suggestion categories
delete individual records where practical
delete all learned data
disable Ollama
uninstall shell integrations
export local data in a readable format
Retention

Raw activity events should have a configurable retention period.

Suggested default:

Raw events: 30 days
Aggregate counts: retained until deleted
Suggestion feedback: retained until deleted

The exact default may change before release, but it must be visible and configurable.

Expired raw records should be removed automatically.

Permissions

Every requested operating-system permission must have:

a plain-language explanation
the feature that requires it
the consequence of declining it
instructions for revoking it

The application must continue with reduced functionality when a permission is denied.

Do not request permissions before the relevant feature is enabled.

Analytics

No analytics should be enabled by default.

If anonymous diagnostics are ever introduced, they must be:

opt-in
documented
separable from core functionality
free of activity-history content
easy to disable
Deletion

“Delete All Learned Data” must:

delete raw activity
delete aggregate transitions
delete suggestion feedback
delete saved learned weights
leave only necessary application configuration unless the user requests a full reset

A full reset option should remove both learning data and settings.

Open-Source Transparency

The repository should document:

what is collected
where it is stored
how it is processed
how long it is retained
what is sent to Ollama
platform-specific differences

Privacy-sensitive behavior changes require documentation updates.

Current Milestone Privacy Status

The current shell stores no durable user activity. It uses synthetic activity
fixtures and in-memory feedback state only.

Implemented now:

pause and resume learning state for the current process
mock suggestion feedback for the current process
synthetic activity labels shown in the dashboard
platform capability labels

Not implemented now:

real application observation
terminal hooks
browser tracking
SQLite persistence
Ollama requests
command execution
application launching
URL opening
telemetry

No real activity data is collected in this milestone.
