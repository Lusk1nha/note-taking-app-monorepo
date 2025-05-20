use axum::http::{HeaderMap, HeaderValue, header::AUTHORIZATION};

use crate::domain::auth::auth_errors::AuthError;

pub struct BearerTokenExtractor;

impl BearerTokenExtractor {
    pub fn extract(headers: &HeaderMap) -> Result<String, AuthError> {
        headers
            .get(AUTHORIZATION)
            .ok_or(AuthError::InvalidCredentials)
            .and_then(|value| Self::parse_header(value))
    }

    fn parse_header(value: &HeaderValue) -> Result<String, AuthError> {
        value
            .to_str()
            .map_err(|_| AuthError::InvalidToken)
            .and_then(|s| Self::extract_token(s))
    }

    fn extract_token(header: &str) -> Result<String, AuthError> {
        header
            .strip_prefix("Bearer ")
            .map(|token| token.trim().to_string())
            .ok_or(AuthError::InvalidToken)
    }
}
