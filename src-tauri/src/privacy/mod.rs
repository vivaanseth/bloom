#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PrivacyFilterResult {
    Allowed(String),
    Rejected,
}

pub fn reject_likely_secret(input: &str) -> PrivacyFilterResult {
    let lower = input.to_ascii_lowercase();
    let secret_markers = [
        "password=",
        "token=",
        "secret=",
        "api_key=",
        "authorization:",
        "private key",
    ];

    if secret_markers.iter().any(|marker| lower.contains(marker)) {
        PrivacyFilterResult::Rejected
    } else {
        PrivacyFilterResult::Allowed(input.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_likely_secret_text() {
        assert_eq!(
            reject_likely_secret("token=abc123"),
            PrivacyFilterResult::Rejected
        );
    }

    #[test]
    fn allows_plain_synthetic_text() {
        assert_eq!(
            reject_likely_secret("git status failed"),
            PrivacyFilterResult::Allowed("git status failed".to_string())
        );
    }
}
