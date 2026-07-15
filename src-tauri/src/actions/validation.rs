use std::collections::HashSet;

use thiserror::Error;
use url::Url;

use crate::models::{ActionPreview, RegisteredAction};

#[derive(Debug, Clone, Default)]
pub struct ActionRegistry {
    registered_commands: HashSet<String>,
    registered_routines: HashSet<String>,
}

impl ActionRegistry {
    pub fn new(
        commands: impl IntoIterator<Item = String>,
        routines: impl IntoIterator<Item = String>,
    ) -> Self {
        Self {
            registered_commands: commands.into_iter().collect(),
            registered_routines: routines.into_iter().collect(),
        }
    }

    pub fn milestone_demo() -> Self {
        Self::new(
            ["npm-run-dev".to_string(), "cargo-test".to_string()],
            ["demo-routine".to_string()],
        )
    }

    fn has_command(&self, command_id: &str) -> bool {
        self.registered_commands.contains(command_id)
    }

    fn has_routine(&self, routine_id: &str) -> bool {
        self.registered_routines.contains(routine_id)
    }
}

#[derive(Debug, Error, Clone, PartialEq, Eq)]
pub enum ValidationError {
    #[error("unknown registered command identifier")]
    UnknownCommand,
    #[error("unknown registered routine identifier")]
    UnknownRoutine,
    #[error("invalid application identifier")]
    InvalidApplicationIdentifier,
    #[error("invalid action identifier")]
    InvalidActionIdentifier,
    #[error("invalid or unsupported URL")]
    InvalidUrl,
    #[error("unsafe action argument")]
    UnsafeArgument,
}

pub fn validate_registered_action(
    action: &RegisteredAction,
    registry: &ActionRegistry,
) -> Result<ActionPreview, ValidationError> {
    match action {
        RegisteredAction::OpenApplication { identifier } => {
            validate_identifier(identifier)
                .map_err(|_| ValidationError::InvalidApplicationIdentifier)?;
            Ok(ActionPreview {
                title: "Open application".to_string(),
                description: format!("Would request application identifier `{identifier}`."),
                requires_confirmation: true,
                execution_available: false,
            })
        }
        RegisteredAction::OpenUrl { url } => {
            validate_url(url)?;
            Ok(ActionPreview {
                title: "Open URL".to_string(),
                description: format!("Would open `{url}` after confirmation in a later milestone."),
                requires_confirmation: true,
                execution_available: false,
            })
        }
        RegisteredAction::RunApprovedCommand {
            command_id,
            arguments,
        } => {
            validate_identifier(command_id)
                .map_err(|_| ValidationError::InvalidActionIdentifier)?;
            if !registry.has_command(command_id) {
                return Err(ValidationError::UnknownCommand);
            }
            for argument in arguments {
                validate_argument(argument)?;
            }
            Ok(ActionPreview {
                title: "Run approved command".to_string(),
                description: format!(
                    "Would prepare registered command `{command_id}` with {} argument(s).",
                    arguments.len()
                ),
                requires_confirmation: true,
                execution_available: false,
            })
        }
        RegisteredAction::LaunchRoutine { routine_id } => {
            validate_identifier(routine_id)
                .map_err(|_| ValidationError::InvalidActionIdentifier)?;
            if !registry.has_routine(routine_id) {
                return Err(ValidationError::UnknownRoutine);
            }
            Ok(ActionPreview {
                title: "Launch routine".to_string(),
                description: format!("Would launch registered routine `{routine_id}`."),
                requires_confirmation: true,
                execution_available: false,
            })
        }
    }
}

fn validate_identifier(identifier: &str) -> Result<(), ()> {
    let is_valid = !identifier.is_empty()
        && identifier.len() <= 128
        && identifier
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'_' | b'-'));

    if is_valid {
        Ok(())
    } else {
        Err(())
    }
}

fn validate_url(raw_url: &str) -> Result<(), ValidationError> {
    let parsed = Url::parse(raw_url).map_err(|_| ValidationError::InvalidUrl)?;

    if !parsed.username().is_empty() || parsed.password().is_some() {
        return Err(ValidationError::InvalidUrl);
    }

    match parsed.scheme() {
        "https" => Ok(()),
        "http" if is_loopback_http(&parsed) => Ok(()),
        _ => Err(ValidationError::InvalidUrl),
    }
}

fn is_loopback_http(parsed: &Url) -> bool {
    matches!(
        parsed.host_str(),
        Some("localhost") | Some("127.0.0.1") | Some("::1")
    )
}

fn validate_argument(argument: &str) -> Result<(), ValidationError> {
    let lower = argument.to_ascii_lowercase();
    let has_control_character = argument.chars().any(char::is_control);
    let has_shell_joiner = [";", "&&", "||", "|", "`", "$("]
        .iter()
        .any(|token| argument.contains(token));
    let looks_secret = ["token=", "password=", "secret=", "authorization:"]
        .iter()
        .any(|token| lower.contains(token));

    if argument.len() > 256 || has_control_character || has_shell_joiner || looks_secret {
        Err(ValidationError::UnsafeArgument)
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_https_url_action_without_execution() {
        let action = RegisteredAction::OpenUrl {
            url: "https://chatgpt.com/".to_string(),
        };

        let preview =
            validate_registered_action(&action, &ActionRegistry::milestone_demo()).expect("valid");

        assert!(preview.requires_confirmation);
        assert!(!preview.execution_available);
    }

    #[test]
    fn rejects_non_loopback_http_urls() {
        let action = RegisteredAction::OpenUrl {
            url: "http://example.com/".to_string(),
        };

        let error = validate_registered_action(&action, &ActionRegistry::milestone_demo())
            .expect_err("http should be rejected");

        assert_eq!(error, ValidationError::InvalidUrl);
    }

    #[test]
    fn allows_loopback_http_for_local_development() {
        let action = RegisteredAction::OpenUrl {
            url: "http://localhost:3000/".to_string(),
        };

        validate_registered_action(&action, &ActionRegistry::milestone_demo()).expect("valid");
    }

    #[test]
    fn rejects_unknown_registered_command() {
        let action = RegisteredAction::RunApprovedCommand {
            command_id: "npm-run-build".to_string(),
            arguments: vec![],
        };

        let error = validate_registered_action(&action, &ActionRegistry::milestone_demo())
            .expect_err("unknown command should be rejected");

        assert_eq!(error, ValidationError::UnknownCommand);
    }

    #[test]
    fn rejects_shell_joiners_inside_arguments() {
        let action = RegisteredAction::RunApprovedCommand {
            command_id: "npm-run-dev".to_string(),
            arguments: vec!["dev; rm -rf /".to_string()],
        };

        let error = validate_registered_action(&action, &ActionRegistry::milestone_demo())
            .expect_err("unsafe argument should be rejected");

        assert_eq!(error, ValidationError::UnsafeArgument);
    }

    #[test]
    fn rejects_unknown_routine() {
        let action = RegisteredAction::LaunchRoutine {
            routine_id: "morning-start".to_string(),
        };

        let error = validate_registered_action(&action, &ActionRegistry::milestone_demo())
            .expect_err("unknown routine should be rejected");

        assert_eq!(error, ValidationError::UnknownRoutine);
    }
}
