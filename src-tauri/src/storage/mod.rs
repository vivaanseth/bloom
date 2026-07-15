use crate::models::{CapabilityDetail, CapabilityStatus};

pub fn milestone_storage_status() -> CapabilityDetail {
    CapabilityDetail::new(
        CapabilityStatus::Unavailable,
        "SQLite persistence",
        "SQLite migrations and durable local storage begin in Milestone 3.",
    )
}
