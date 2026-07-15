use crate::models::{ApplicationInfo, PlatformCapabilities};

#[cfg(target_os = "linux")]
mod linux;
#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "windows")]
mod windows;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PlatformError {
    ObservationUnavailable,
}

pub trait PlatformObserver {
    fn capabilities(&self) -> PlatformCapabilities;

    fn start(&mut self) -> Result<(), PlatformError>;

    fn stop(&mut self) -> Result<(), PlatformError>;

    fn active_application(&self) -> Result<Option<ApplicationInfo>, PlatformError>;
}

#[derive(Debug, Default)]
pub struct NoopPlatformObserver;

impl PlatformObserver for NoopPlatformObserver {
    fn capabilities(&self) -> PlatformCapabilities {
        current_capabilities()
    }

    fn start(&mut self) -> Result<(), PlatformError> {
        Ok(())
    }

    fn stop(&mut self) -> Result<(), PlatformError> {
        Ok(())
    }

    fn active_application(&self) -> Result<Option<ApplicationInfo>, PlatformError> {
        Err(PlatformError::ObservationUnavailable)
    }
}

pub fn current_capabilities() -> PlatformCapabilities {
    platform_capabilities()
}

#[cfg(target_os = "macos")]
fn platform_capabilities() -> PlatformCapabilities {
    macos::capabilities()
}

#[cfg(target_os = "windows")]
fn platform_capabilities() -> PlatformCapabilities {
    windows::capabilities()
}

#[cfg(target_os = "linux")]
fn platform_capabilities() -> PlatformCapabilities {
    linux::capabilities()
}

#[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
fn platform_capabilities() -> PlatformCapabilities {
    use crate::models::{CapabilityDetail, CapabilityStatus};

    PlatformCapabilities {
        operating_system: std::env::consts::OS.to_string(),
        system_tray: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "System tray",
            "This platform is outside the supported desktop target list.",
        ),
        transparent_window: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Transparent companion window",
            "This platform is outside the supported desktop target list.",
        ),
        application_observation: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Application observation",
            "Real observation is deferred to later milestones.",
        ),
        terminal_integration: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Terminal integration",
            "Terminal hooks are not included in this milestone.",
        ),
        local_persistence: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "SQLite persistence",
            "Persistence is deferred to Milestone 3.",
        ),
        ollama: CapabilityDetail::new(
            CapabilityStatus::Unavailable,
            "Ollama",
            "Optional Ollama integration is deferred to Milestone 10.",
        ),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn noop_observer_reports_capabilities_but_no_active_app() {
        let observer = NoopPlatformObserver;

        assert!(!observer.capabilities().operating_system.is_empty());
        assert_eq!(
            observer.active_application(),
            Err(PlatformError::ObservationUnavailable)
        );
    }
}
