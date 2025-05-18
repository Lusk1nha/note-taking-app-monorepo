use thiserror::Error;

use crate::domain::{
    auth_provider::auth_provider_errors::AuthProviderServiceError,
    credentials::credentials_errors::CredentialsServiceError, user::user_errors::UserServiceError,
};

#[derive(Debug, Error)]
pub enum AuthError {
    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("User already exists")]
    UserExists,

    #[error("Password complexity requirements not met")]
    WeakPassword,

    #[error("Error to transaction: {0}")]
    TransactionError(#[from] sqlx::Error),

    #[error("Error creating user: {0}")]
    UserCreationError(#[from] UserServiceError),

    #[error("Error creating credentials {0}")]
    CredentialsCreationError(#[from] CredentialsServiceError),

    #[error("Error creating auth provider: {0}")]
    AuthProviderCreationError(#[from] AuthProviderServiceError),
}
