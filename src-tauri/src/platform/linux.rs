use crate::models::{CapabilityDetail, CapabilityStatus, PlatformCapabilities};

pub fn capabilities() -> PlatformCapabilities {
    PlatformCapabilities {
        operating_system: "Linux".to_string(),
        system_tray: CapabilityDetail::new(
            CapabilityStatus::Experimental,
            "System tray",
            "Tray menu support varies by desktop environment. Click events are not claimed.",
        ),
        transparent_window: CapabilityDetail::new(
            CapabilityStatus::Experimental,
            "Transparent companion window",
            "Transparency depends on the compositor and must be verified per environment.",
        ),
        application_observation: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Application observation",
            "Deferred to Milestone 6. No real app monitoring is active.",
        ),
        terminal_integration: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Terminal integration",
            "zsh and bash integrations are deferred to Milestone 8.",
        ),
        local_persistence: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "SQLite persistence",
            "This milestone uses in-memory state only.",
        ),
        ollama: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Ollama",
            "Optional localhost Ollama support is deferred to Milestone 10.",
        ),
    }
}
