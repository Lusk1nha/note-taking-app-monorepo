use sqlx::{Postgres, Transaction};

use crate::{
    domain::auth_provider::{
        auth_provider_errors::AuthProviderServiceError,
        auth_provider_model::{AuthProvider, CreateAuthProvider, CreateAuthProviderDto},
    },
    repositories::auth_provider_repository::AuthProviderRepository,
};

#[derive(Clone)]
pub struct AuthProviderService<R: AuthProviderRepository> {
    repository: R,
}

impl<R: AuthProviderRepository> AuthProviderService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn create_auth_provider(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAuthProviderDto,
    ) -> Result<AuthProvider, AuthProviderServiceError> {
        payload.validate()?;

        let create_auth_provider = CreateAuthProvider {
            id: payload.user_id,
            provider_type: payload.provider_type,
        };

        self.repository
            .create(executor, create_auth_provider)
            .await
            .map_err(Into::into)
    }
}
