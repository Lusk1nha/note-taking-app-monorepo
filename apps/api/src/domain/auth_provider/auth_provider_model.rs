use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};

use super::auth_provider_errors::AuthProviderServiceError;

#[derive(Debug, Type, Serialize, Deserialize, PartialEq)]
#[sqlx(type_name = "auth_provider_type")]
#[sqlx(rename_all = "UPPERCASE")]
pub enum AuthProviderType {
    Google,
    Credentials,
}

#[derive(FromRow, Serialize)]
pub struct AuthProvider {
    pub id: String,
    pub provider_type: AuthProviderType,
    pub created_at: DateTime<Utc>,
}

pub struct CreateAuthProviderDto {
    pub user_id: String,
    pub provider_type: AuthProviderType,
}

impl CreateAuthProviderDto {
    pub fn validate(&self) -> Result<(), AuthProviderServiceError> {
        if self.user_id.is_empty() {
            return Err(AuthProviderServiceError::ValidationError(
                "User ID cannot be empty".to_string(),
            ));
        }

        match self.provider_type {
            AuthProviderType::Google => {}
            AuthProviderType::Credentials => {}
        }

        Ok(())
    }
}

pub struct CreateAuthProvider {
    pub id: String,
    pub provider_type: AuthProviderType,
}
