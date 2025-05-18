use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::prelude::FromRow;

use super::credentials_errors::CredentialsServiceError;

#[derive(FromRow, Serialize)]
pub struct Credentials {
    pub id: String,
    pub email: String,
    pub password_hash: String,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct CreateCredentialsDto {
    pub user_id: String,
    pub email: String,
    pub password: String,
}

impl CreateCredentialsDto {
    pub fn validate(&self) -> Result<(), CredentialsServiceError> {
        if self.user_id.trim().is_empty() {
            return Err(CredentialsServiceError::ValidationError(
                "Invalid user ID".into(),
            ));
        }

        if self.email.trim().is_empty() {
            return Err(CredentialsServiceError::ValidationError(
                "Invalid email".into(),
            ));
        }

        if self.password.trim().is_empty() {
            return Err(CredentialsServiceError::ValidationError(
                "Invalid password hash".into(),
            ));
        }

        Ok(())
    }
}

pub struct CreateCredentials {
    pub id: String,
    pub email: String,
    pub password_hash: String,
}
