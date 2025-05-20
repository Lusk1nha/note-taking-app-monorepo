use thiserror::Error;

use crate::errors::sqlx_repository_errors::RepositoryError;

#[derive(Error, Debug)]
pub enum AdminServiceError {
    #[error("Error in the repository: {0}")]
    RepositoryError(#[from] RepositoryError),

    #[error("Error in the transaction: {0}")]
    TransactionError(String),
}
