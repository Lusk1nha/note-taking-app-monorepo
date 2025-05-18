use crate::{
    domain::credentials::{
        credentials_errors::CredentialsServiceError,
        credentials_model::{CreateCredentials, CreateCredentialsDto, Credentials},
    },
    repositories::credentials_repository::CredentialsRepository,
};

use bcrypt::{DEFAULT_COST, hash, verify};
use sqlx::{Postgres, Transaction};

#[derive(Clone)]
pub struct CredentialsService<R: CredentialsRepository> {
    repository: R,
}

impl<R: CredentialsRepository> CredentialsService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn get_credentials_by_email(
        &self,
        email: &str,
    ) -> Result<Option<Credentials>, CredentialsServiceError> {
        self.repository
            .get_by_email(email)
            .await
            .map_err(Into::into)
    }

    pub async fn create_credentials(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateCredentialsDto,
    ) -> Result<Credentials, CredentialsServiceError> {
        payload.validate()?;

        let password_hash = self
            .hash_password(&payload.password)
            .map_err(CredentialsServiceError::HashingError)?;

        let credentials = CreateCredentials {
            id: payload.user_id,
            email: payload.email,
            password_hash,
        };

        self.repository
            .create(executor, credentials)
            .await
            .map_err(Into::into)
    }

    pub fn verify_hash_password(
        &self,
        password: &str,
        hash: &str,
    ) -> Result<bool, bcrypt::BcryptError> {
        verify(password, hash)
    }

    fn hash_password(&self, password: &str) -> Result<String, bcrypt::BcryptError> {
        hash(password, DEFAULT_COST)
    }
}
