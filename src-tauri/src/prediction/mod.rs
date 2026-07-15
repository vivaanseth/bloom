use thiserror::Error;

use crate::models::{PredictionContext, SuggestionCandidate};

#[derive(Debug, Error, Clone, PartialEq, Eq)]
pub enum PredictionError {
    #[error("prediction is not implemented in this milestone")]
    NotImplemented,
}

pub trait Predictor {
    fn predict(
        &self,
        context: &PredictionContext,
    ) -> Result<Vec<SuggestionCandidate>, PredictionError>;
}

#[derive(Debug, Default)]
pub struct NoopPredictor;

impl Predictor for NoopPredictor {
    fn predict(
        &self,
        _context: &PredictionContext,
    ) -> Result<Vec<SuggestionCandidate>, PredictionError> {
        Ok(Vec::new())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn noop_predictor_returns_no_candidates() {
        let predictor = NoopPredictor;
        let candidates = predictor
            .predict(&PredictionContext {
                current_application_identifier: Some("com.microsoft.Edge".to_string()),
                previous_application_identifier: None,
                weekday: Some("Tuesday".to_string()),
                time_of_day_bucket: Some("afternoon".to_string()),
            })
            .expect("prediction should not fail");

        assert!(candidates.is_empty());
    }
}
