use thiserror::Error;

use crate::errors::sqlx_repository_errors::RepositoryError;

#[derive(Error, Debug)]
pub enum CredentialsServiceError {
    #[error("Error validating credentials: {0}")]
    ValidationError(String),

    #[error("Error hashing password: {0}")]
    HashingError(#[from] bcrypt::BcryptError),

    #[error("Error in the repository: {0}")]
    RepositoryError(#[from] RepositoryError),

    #[error("Error in the transaction: {0}")]
    TransactionError(String),
}
