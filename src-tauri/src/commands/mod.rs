use serde::Serialize;
use tauri::{AppHandle, Emitter, State};

use crate::models::{
    ActivityEvent, LearningState, PlatformCapabilities, Suggestion, SuggestionFeedback,
    SuggestionFeedbackRequest,
};
use crate::{platform, state::AppState, suggestions};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandError {
    pub code: String,
    pub message: String,
}

impl CommandError {
    fn new(code: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            message: message.into(),
        }
    }
}

#[tauri::command]
pub fn get_platform_capabilities() -> PlatformCapabilities {
    platform::current_capabilities()
}

#[tauri::command]
pub fn get_mock_suggestion() -> Suggestion {
    suggestions::mock_suggestion()
}

#[tauri::command]
pub fn respond_to_mock_suggestion(
    request: SuggestionFeedbackRequest,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<SuggestionFeedback, CommandError> {
    let feedback = state
        .record_feedback(request)
        .map_err(|error| match error {
            crate::state::StateError::UnknownSuggestion => CommandError::new(
                "unknownSuggestion",
                "The suggestion is not available in this session.",
            ),
            crate::state::StateError::MissingSnoozeDuration => CommandError::new(
                "missingSnoozeDuration",
                "Snooze feedback requires a duration.",
            ),
        })?;

    let _ = app.emit("suggestion-feedback-recorded", &feedback);
    Ok(feedback)
}

#[tauri::command]
pub fn list_mock_activity() -> Vec<ActivityEvent> {
    suggestions::mock_activity()
}

#[tauri::command]
pub fn get_learning_state(state: State<'_, AppState>) -> LearningState {
    state.learning_state()
}

#[tauri::command]
pub fn set_learning_paused(
    paused: bool,
    state: State<'_, AppState>,
    app: AppHandle,
) -> LearningState {
    let learning_state = state.set_learning_paused(paused);
    let _ = app.emit("learning-state-changed", &learning_state);
    learning_state
}
