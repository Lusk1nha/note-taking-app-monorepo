use thiserror::Error;

use crate::domain::{
    admin::admin_errors::AdminServiceError,
    auth_provider::auth_provider_errors::AuthProviderServiceError,
    credentials::credentials_errors::CredentialsServiceError, user::user_errors::UserServiceError,
};

#[derive(Debug, Error)]
pub enum AuthError {
    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("User already exists")]
    UserAlreadyExists,

    #[error("Password complexity requirements not met")]
    WeakPassword,

    #[error("Invalid token")]
    InvalidToken,

    #[error("Error to transaction: {0}")]
    TransactionError(#[from] sqlx::Error),

    #[error("Error creating user: {0}")]
    UserCreationError(#[from] UserServiceError),

    #[error("Error creating credentials {0}")]
    CredentialsCreationError(#[from] CredentialsServiceError),

    #[error("Error creating auth provider: {0}")]
    AuthProviderCreationError(#[from] AuthProviderServiceError),

    #[error("Error creating JWT token: {0}")]
    JwtCreationError(#[from] jsonwebtoken::errors::Error),

    #[error("Error getting admin role: {0}")]
    GetAdminRoleError(#[from] AdminServiceError),
}
