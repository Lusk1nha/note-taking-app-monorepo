use crate::{
    domain::credentials::{
        credentials_errors::CredentialsServiceError,
        credentials_model::{CreateCredentials, CreateCredentialsDto, Credentials},
    },
    repositories::credentials_repository::CredentialsRepository,
};

use async_trait::async_trait;
use bcrypt::{DEFAULT_COST, hash, verify};
use sqlx::{Postgres, Transaction};

#[async_trait]
pub trait CredentialsServiceTrait: Send + Sync {
    async fn get_by_email(
        &self,
        email: &str,
    ) -> Result<Option<Credentials>, CredentialsServiceError>;

    async fn email_exists(&self, email: &str) -> Result<bool, CredentialsServiceError>;

    async fn verify_password(
        &self,
        password: &str,
        hashed_password: &str,
    ) -> Result<(), CredentialsServiceError>;

    async fn create_credentials(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateCredentialsDto,
    ) -> Result<Credentials, CredentialsServiceError>;
}

#[derive(Clone)]
pub struct CredentialsService<R: CredentialsRepository> {
    repository: R,
}

impl<R> CredentialsService<R>
where
    R: CredentialsRepository,
{
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[async_trait]
impl<R> CredentialsServiceTrait for CredentialsService<R>
where
    R: CredentialsRepository + Send + Sync,
{
    async fn get_by_email(
        &self,
        email: &str,
    ) -> Result<Option<Credentials>, CredentialsServiceError> {
        self.repository
            .get_by_email(email)
            .await
            .map_err(Into::into)
    }

    async fn email_exists(&self, email: &str) -> Result<bool, CredentialsServiceError> {
        let user_by_email = self.get_by_email(email).await?;

        match user_by_email {
            Some(_) => Ok(true),
            None => Ok(false),
        }
    }

    async fn verify_password(
        &self,
        password: &str,
        hashed_password: &str,
    ) -> Result<(), CredentialsServiceError> {
        verify(password, hashed_password)
            .map_err(|_| CredentialsServiceError::InvalidCredentials)
            .and_then(|is_valid| {
                if is_valid {
                    Ok(())
                } else {
                    Err(CredentialsServiceError::InvalidCredentials)
                }
            })
    }

    async fn create_credentials(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateCredentialsDto,
    ) -> Result<Credentials, CredentialsServiceError> {
        payload.validate()?;

        let hashed_password =
            hash(payload.password, DEFAULT_COST).map_err(CredentialsServiceError::HashingError)?;

        let credentials = CreateCredentials {
            id: payload.user_id.to_string(),
            email: payload.email,
            password_hash: hashed_password,
        };

        self.repository
            .create(executor, credentials)
            .await
            .map_err(Into::into)
    }
}
