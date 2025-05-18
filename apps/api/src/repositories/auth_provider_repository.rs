use async_trait::async_trait;
use sqlx::{Postgres, Transaction};

use std::sync::Arc;
use tokio::sync::Mutex;

use crate::{
    database::AppDatabasePool,
    domain::auth_provider::auth_provider_model::{
        AuthProvider, AuthProviderType, CreateAuthProvider,
    },
    errors::sqlx_repository_errors::RepositoryError,
};

#[async_trait]
pub trait AuthProviderRepository: Send + Sync {
    async fn create(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAuthProvider,
    ) -> Result<AuthProvider, RepositoryError>;
}

#[derive(Debug, Clone)]
pub struct PostgresAuthProviderRepository {
    pool: Arc<Mutex<AppDatabasePool>>,
}

impl PostgresAuthProviderRepository {
    pub fn new(pool: Arc<Mutex<AppDatabasePool>>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl AuthProviderRepository for PostgresAuthProviderRepository {
    async fn create(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAuthProvider,
    ) -> Result<AuthProvider, RepositoryError> {
        sqlx::query_as!(
            AuthProvider,
            r#"
            INSERT INTO auth_providers (id, provider_type)
            VALUES ($1, $2)
            RETURNING id, provider_type AS "provider_type!: AuthProviderType", created_at
            "#,
            payload.id,
            payload.provider_type as AuthProviderType,
        )
        .fetch_one(&mut **executor)
        .await
        .map_err(|e| RepositoryError::QueryError(e.into()))
    }
}
