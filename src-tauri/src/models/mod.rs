use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum CapabilityStatus {
    Supported,
    Beta,
    Experimental,
    Unavailable,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CapabilityDetail {
    pub status: CapabilityStatus,
    pub label: String,
    pub detail: String,
}

impl CapabilityDetail {
    pub fn new(
        status: CapabilityStatus,
        label: impl Into<String>,
        detail: impl Into<String>,
    ) -> Self {
        Self {
            status,
            label: label.into(),
            detail: detail.into(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct PlatformCapabilities {
    pub operating_system: String,
    pub system_tray: CapabilityDetail,
    pub transparent_window: CapabilityDetail,
    pub application_observation: CapabilityDetail,
    pub terminal_integration: CapabilityDetail,
    pub local_persistence: CapabilityDetail,
    pub ollama: CapabilityDetail,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ApplicationInfo {
    pub identifier: String,
    pub display_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "kind", rename_all = "camelCase")]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ActionPreview {
    pub title: String,
    pub description: String,
    pub requires_confirmation: bool,
    pub execution_available: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PredictionFactor {
    pub label: String,
    pub detail: String,
    pub weight: f32,
    pub synthetic: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PredictionExplanation {
    pub summary: String,
    pub factors: Vec<PredictionFactor>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum SuggestionStatus {
    Ready,
    Accepted,
    Dismissed,
    Snoozed,
    Disabled,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Suggestion {
    pub id: String,
    pub title: String,
    pub body: String,
    pub action_label: String,
    pub action: RegisteredAction,
    pub status: SuggestionStatus,
    pub confidence: f32,
    pub explanation: PredictionExplanation,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum SuggestionFeedbackKind {
    Accepted,
    Dismissed,
    Snoozed,
    Disabled,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SuggestionFeedbackRequest {
    pub suggestion_id: String,
    pub feedback: SuggestionFeedbackKind,
    pub snooze_minutes: Option<u16>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SuggestionFeedback {
    pub id: String,
    pub suggestion_id: String,
    pub feedback: SuggestionFeedbackKind,
    pub snooze_minutes: Option<u16>,
    pub recorded_at_label: String,
    pub action_was_executed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ActivityEvent {
    pub id: String,
    pub source: String,
    pub category: String,
    pub occurred_at_label: String,
    pub summary: String,
    pub detail: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct LearningState {
    pub is_paused: bool,
    pub paused_reason: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct PredictionContext {
    pub current_application_identifier: Option<String>,
    pub previous_application_identifier: Option<String>,
    pub weekday: Option<String>,
    pub time_of_day_bucket: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SuggestionCandidate {
    pub suggestion: Suggestion,
    pub score: f32,
    pub explanation: PredictionExplanation,
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn registered_action_uses_tagged_camel_case_shape() {
        let action = RegisteredAction::OpenUrl {
            url: "https://chatgpt.com/".to_string(),
        };

        let value = serde_json::to_value(action).expect("serialize action");

        assert_eq!(
            value,
            json!({
                "kind": "openUrl",
                "url": "https://chatgpt.com/"
            })
        );
    }

    #[test]
    fn feedback_request_uses_frontend_field_names() {
        let request = SuggestionFeedbackRequest {
            suggestion_id: "mock-open-chatgpt-after-edge".to_string(),
            feedback: SuggestionFeedbackKind::Snoozed,
            snooze_minutes: Some(15),
        };

        let value = serde_json::to_value(request).expect("serialize feedback request");

        assert_eq!(
            value,
            json!({
                "suggestionId": "mock-open-chatgpt-after-edge",
                "feedback": "snoozed",
                "snoozeMinutes": 15
            })
        );
    }
}
