use crate::privacy::{reject_likely_secret, PrivacyFilterResult};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TerminalEventPreview {
    pub shell: String,
    pub command: String,
    pub exit_status: Option<i32>,
}

pub fn validate_terminal_preview(event: TerminalEventPreview) -> PrivacyFilterResult {
    reject_likely_secret(&format!(
        "{}:{}:{:?}",
        event.shell, event.command, event.exit_status
    ))
}
