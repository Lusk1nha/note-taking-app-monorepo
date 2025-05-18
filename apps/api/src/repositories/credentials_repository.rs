use async_trait::async_trait;
use sqlx::{Postgres, Transaction};

use std::sync::Arc;
use tokio::sync::Mutex;

use crate::{
    database::AppDatabasePool,
    domain::credentials::credentials_model::{CreateCredentials, Credentials},
    errors::sqlx_repository_errors::RepositoryError,
};

#[async_trait]
pub trait CredentialsRepository: Send + Sync {
    async fn get_by_email(&self, email: &str) -> Result<Option<Credentials>, RepositoryError>;
    async fn create(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateCredentials,
    ) -> Result<Credentials, RepositoryError>;
}

#[derive(Debug, Clone)]
pub struct PostgresCredentialsRepository {
    pool: Arc<Mutex<AppDatabasePool>>,
}

impl PostgresCredentialsRepository {
    pub fn new(pool: Arc<Mutex<AppDatabasePool>>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl CredentialsRepository for PostgresCredentialsRepository {
    async fn get_by_email(&self, email: &str) -> Result<Option<Credentials>, RepositoryError> {
        let mut conn: sqlx::pool::PoolConnection<sqlx::Postgres> =
            self.pool.lock().await.acquire().await?;

        sqlx::query_as!(
            Credentials,
            r#"
            SELECT * FROM credentials WHERE email = $1
            "#,
            email
        )
        .fetch_optional(&mut *conn)
        .await
        .map_err(|e| RepositoryError::QueryError(e.into()))
    }

    async fn create(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateCredentials,
    ) -> Result<Credentials, RepositoryError> {
        sqlx::query_as!(
            Credentials,
            r#"
            INSERT INTO credentials (id, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING *
            "#,
            payload.id,
            payload.email,
            payload.password_hash
        )
        .fetch_one(&mut **executor)
        .await
        .map_err(|e| RepositoryError::QueryError(e.into()))
    }
}
