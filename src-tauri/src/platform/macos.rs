use crate::models::{CapabilityDetail, CapabilityStatus, PlatformCapabilities};

pub fn capabilities() -> PlatformCapabilities {
    PlatformCapabilities {
        operating_system: "macOS".to_string(),
        system_tray: CapabilityDetail::new(
            CapabilityStatus::Supported,
            "System tray",
            "Tray menu is implemented for this milestone.",
        ),
        transparent_window: CapabilityDetail::new(
            CapabilityStatus::Supported,
            "Transparent companion window",
            "Implemented with a transparent Tauri window. App Store distribution is not claimed.",
        ),
        application_observation: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Application observation",
            "Deferred to Milestone 4. No real app monitoring is active.",
        ),
        terminal_integration: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Terminal integration",
            "Explicit shell integrations are deferred to Milestone 8.",
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
