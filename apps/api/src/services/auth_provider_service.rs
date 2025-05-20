use async_trait::async_trait;
use sqlx::{Postgres, Transaction};

use crate::{
    domain::auth_provider::{
        auth_provider_errors::AuthProviderServiceError,
        auth_provider_model::{AuthProvider, CreateAuthProvider, CreateAuthProviderDto},
    },
    repositories::auth_provider_repository::AuthProviderRepository,
};

#[async_trait]
pub trait AuthProviderServiceTrait: Send + Sync {
    async fn create_auth_provider(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAuthProviderDto,
    ) -> Result<AuthProvider, AuthProviderServiceError>;
}

#[derive(Clone)]
pub struct AuthProviderService<R: AuthProviderRepository> {
    repository: R,
}

impl<R> AuthProviderService<R>
where
    R: AuthProviderRepository,
{
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[async_trait]
impl<R> AuthProviderServiceTrait for AuthProviderService<R>
where
    R: AuthProviderRepository + Send + Sync,
{
    async fn create_auth_provider(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAuthProviderDto,
    ) -> Result<AuthProvider, AuthProviderServiceError> {
        payload.validate()?;

        let auth_provider = CreateAuthProvider {
            id: payload.user_id,
            provider_type: payload.provider_type,
        };

        self.repository
            .create(executor, auth_provider)
            .await
            .map_err(Into::into)
    }
}
