# Security Policy

## Supported Versions

Bloom is currently in public alpha. Security fixes apply to the latest
prerelease only.

| Version | Supported |
| --- | --- |
| `0.1.0-alpha.1` | Yes |

## Reporting A Vulnerability

Please do not open public issues for vulnerabilities.

Report security concerns through GitHub private vulnerability reporting for
`vivaanseth/bloom` when available. If private reporting is unavailable, open a
minimal issue asking for a private contact path without including exploit
details.

## Security Boundaries

Bloom's frontend is not a security boundary. Sensitive behavior must live in the
Rust backend and pass through registered validation.

The alpha release does not execute commands, launch apps, open URLs, persist
activity, install shell hooks, call Ollama, or observe real app activity.

## Release Trust

Alpha artifacts are unsigned. Verify downloads using the published
`SHASUMS256.txt` checksum. Signing and notarization are planned for a later
release milestone.
