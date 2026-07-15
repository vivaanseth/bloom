use thiserror::Error;

use crate::models::RegisteredAction;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RephraseRequest {
    pub suggestion_text: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommandExplanationRequest {
    pub command_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ActionMatchRequest {
    pub phrase: String,
    pub registered_actions: Vec<RegisteredAction>,
}

#[derive(Debug, Error, Clone, PartialEq, Eq)]
pub enum LanguageError {
    #[error("local language service is unavailable")]
    Unavailable,
}

pub trait LanguageService {
    fn is_available(&self) -> bool;

    fn rephrase_suggestion(&self, input: RephraseRequest) -> Result<String, LanguageError>;

    fn explain_command(&self, input: CommandExplanationRequest) -> Result<String, LanguageError>;

    fn match_registered_action(
        &self,
        input: ActionMatchRequest,
    ) -> Result<Option<String>, LanguageError>;
}

#[derive(Debug, Default)]
pub struct TemplateLanguageService;

impl LanguageService for TemplateLanguageService {
    fn is_available(&self) -> bool {
        true
    }

    fn rephrase_suggestion(&self, input: RephraseRequest) -> Result<String, LanguageError> {
        Ok(input.suggestion_text)
    }

    fn explain_command(&self, input: CommandExplanationRequest) -> Result<String, LanguageError> {
        Ok(format!(
            "Command `{}` is known only if it is registered by the app.",
            input.command_id
        ))
    }

    fn match_registered_action(
        &self,
        _input: ActionMatchRequest,
    ) -> Result<Option<String>, LanguageError> {
        Ok(None)
    }
}

#[derive(Debug, Default)]
pub struct OllamaLanguageService;

impl LanguageService for OllamaLanguageService {
    fn is_available(&self) -> bool {
        false
    }

    fn rephrase_suggestion(&self, _input: RephraseRequest) -> Result<String, LanguageError> {
        Err(LanguageError::Unavailable)
    }

    fn explain_command(&self, _input: CommandExplanationRequest) -> Result<String, LanguageError> {
        Err(LanguageError::Unavailable)
    }

    fn match_registered_action(
        &self,
        _input: ActionMatchRequest,
    ) -> Result<Option<String>, LanguageError> {
        Err(LanguageError::Unavailable)
    }
}
