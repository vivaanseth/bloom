use crate::models::{
    ActivityEvent, PredictionExplanation, PredictionFactor, RegisteredAction, Suggestion,
    SuggestionStatus,
};

pub const MOCK_SUGGESTION_ID: &str = "mock-open-chatgpt-after-edge";

pub fn mock_suggestion() -> Suggestion {
    Suggestion {
        id: MOCK_SUGGESTION_ID.to_string(),
        title: "Open ChatGPT".to_string(),
        body: "You usually open ChatGPT after Edge in the afternoon.".to_string(),
        action_label: "Open ChatGPT".to_string(),
        action: RegisteredAction::OpenUrl {
            url: "https://chatgpt.com/".to_string(),
        },
        status: SuggestionStatus::Ready,
        confidence: 0.72,
        explanation: PredictionExplanation {
            summary: "Synthetic demo pattern from the visual shell milestone.".to_string(),
            factors: vec![
                PredictionFactor {
                    label: "Previous app".to_string(),
                    detail: "Edge was opened before this suggestion.".to_string(),
                    weight: 0.32,
                    synthetic: true,
                },
                PredictionFactor {
                    label: "Transition frequency".to_string(),
                    detail: "ChatGPT followed Edge in 8 of 10 synthetic examples.".to_string(),
                    weight: 0.28,
                    synthetic: true,
                },
                PredictionFactor {
                    label: "Time bucket".to_string(),
                    detail: "This mock pattern is marked as an afternoon habit.".to_string(),
                    weight: 0.12,
                    synthetic: true,
                },
            ],
        },
    }
}

pub fn mock_activity() -> Vec<ActivityEvent> {
    vec![
        ActivityEvent {
            id: "synthetic-edge-opened".to_string(),
            source: "synthetic".to_string(),
            category: "Application".to_string(),
            occurred_at_label: "Today, 2:10 PM".to_string(),
            summary: "Edge opened".to_string(),
            detail: "Demo event only. No real application monitoring is active.".to_string(),
        },
        ActivityEvent {
            id: "synthetic-chatgpt-followed".to_string(),
            source: "synthetic".to_string(),
            category: "Pattern".to_string(),
            occurred_at_label: "Today, 2:12 PM".to_string(),
            summary: "ChatGPT followed Edge".to_string(),
            detail: "Synthetic transition used to explain the mock suggestion.".to_string(),
        },
        ActivityEvent {
            id: "synthetic-pause-available".to_string(),
            source: "synthetic".to_string(),
            category: "Control".to_string(),
            occurred_at_label: "Always available".to_string(),
            summary: "Pause Learning can be toggled".to_string(),
            detail: "The toggle changes in-memory state only for this milestone.".to_string(),
        },
    ]
}
