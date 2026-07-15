use crate::models::{CapabilityDetail, CapabilityStatus, PlatformCapabilities};

pub fn capabilities() -> PlatformCapabilities {
    PlatformCapabilities {
        operating_system: "Windows".to_string(),
        system_tray: CapabilityDetail::new(
            CapabilityStatus::Supported,
            "System tray",
            "Tray menu is implemented, but this workspace has not run on Windows hardware.",
        ),
        transparent_window: CapabilityDetail::new(
            CapabilityStatus::Beta,
            "Transparent companion window",
            "Configured through Tauri and must be verified on a real Windows machine.",
        ),
        application_observation: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Application observation",
            "Deferred to Milestone 5. No real app monitoring is active.",
        ),
        terminal_integration: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Terminal integration",
            "PowerShell integration is deferred to Milestone 8.",
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
