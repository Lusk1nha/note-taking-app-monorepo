use thiserror::Error;

use crate::domain::{credentials::credentials_errors::CredentialsServiceError, user::user_errors::UserServiceError};

#[derive(Debug, Error)]
pub enum AuthError {
    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("User already exists")]
    UserExists,

    #[error("Password complexity requirements not met")]
    WeakPassword,

    #[error("Error creating user: {0}")]
    UserCreationError(#[from] UserServiceError),

    #[error("Error creating credentials {0}")]
    CredentialsCreationError(#[from] CredentialsServiceError),
}
