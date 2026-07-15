use std::sync::Mutex;

use crate::models::{
    LearningState, SuggestionFeedback, SuggestionFeedbackKind, SuggestionFeedbackRequest,
};
use crate::suggestions::MOCK_SUGGESTION_ID;

#[derive(Debug, Default)]
pub struct AppState {
    inner: Mutex<AppStateInner>,
}

#[derive(Debug, Default)]
struct AppStateInner {
    learning_paused: bool,
    feedback: Vec<SuggestionFeedback>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StateError {
    UnknownSuggestion,
    MissingSnoozeDuration,
}

impl AppState {
    pub fn learning_state(&self) -> LearningState {
        let inner = self.lock_inner();
        learning_state_from_bool(inner.learning_paused)
    }

    pub fn set_learning_paused(&self, paused: bool) -> LearningState {
        let mut inner = self.lock_inner();
        inner.learning_paused = paused;
        learning_state_from_bool(paused)
    }

    pub fn toggle_learning_paused(&self) -> LearningState {
        let mut inner = self.lock_inner();
        inner.learning_paused = !inner.learning_paused;
        learning_state_from_bool(inner.learning_paused)
    }

    pub fn record_feedback(
        &self,
        request: SuggestionFeedbackRequest,
    ) -> Result<SuggestionFeedback, StateError> {
        if request.suggestion_id != MOCK_SUGGESTION_ID {
            return Err(StateError::UnknownSuggestion);
        }

        if request.feedback == SuggestionFeedbackKind::Snoozed && request.snooze_minutes.is_none() {
            return Err(StateError::MissingSnoozeDuration);
        }

        let mut inner = self.lock_inner();
        let feedback = SuggestionFeedback {
            id: format!("feedback-{}", inner.feedback.len() + 1),
            suggestion_id: request.suggestion_id,
            feedback: request.feedback,
            snooze_minutes: request.snooze_minutes,
            recorded_at_label: "Recorded in this session".to_string(),
            action_was_executed: false,
        };
        inner.feedback.push(feedback.clone());
        Ok(feedback)
    }

    fn lock_inner(&self) -> std::sync::MutexGuard<'_, AppStateInner> {
        self.inner
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
    }
}

fn learning_state_from_bool(is_paused: bool) -> LearningState {
    LearningState {
        is_paused,
        paused_reason: is_paused.then(|| "Paused by user".to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pause_learning_updates_state() {
        let state = AppState::default();

        let paused = state.set_learning_paused(true);

        assert!(paused.is_paused);
        assert_eq!(
            state.learning_state().paused_reason,
            Some("Paused by user".to_string())
        );
    }

    #[test]
    fn feedback_never_executes_action_in_milestone_one() {
        let state = AppState::default();
        let feedback = state
            .record_feedback(SuggestionFeedbackRequest {
                suggestion_id: MOCK_SUGGESTION_ID.to_string(),
                feedback: SuggestionFeedbackKind::Accepted,
                snooze_minutes: None,
            })
            .expect("feedback should record");

        assert_eq!(feedback.feedback, SuggestionFeedbackKind::Accepted);
        assert!(!feedback.action_was_executed);
    }

    #[test]
    fn snooze_requires_duration() {
        let state = AppState::default();
        let error = state
            .record_feedback(SuggestionFeedbackRequest {
                suggestion_id: MOCK_SUGGESTION_ID.to_string(),
                feedback: SuggestionFeedbackKind::Snoozed,
                snooze_minutes: None,
            })
            .expect_err("missing duration should fail");

        assert_eq!(error, StateError::MissingSnoozeDuration);
    }
}
