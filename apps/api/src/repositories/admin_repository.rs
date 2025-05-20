use async_trait::async_trait;
use sqlx::{Postgres, Transaction};

use std::sync::Arc;
use tokio::sync::Mutex;

use crate::{
    database::AppDatabasePool,
    domain::admin::admin_model::{Admin, CreateAdmin},
    errors::sqlx_repository_errors::RepositoryError,
};

#[async_trait]
pub trait AdminRepository: Send + Sync {
    async fn get_by_id(&self, id: &str) -> Result<Option<Admin>, RepositoryError>;
    async fn create(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAdmin,
    ) -> Result<Admin, RepositoryError>;
}

#[derive(Debug, Clone)]
pub struct PostgresAdminRepository {
    pool: Arc<Mutex<AppDatabasePool>>,
}

impl PostgresAdminRepository {
    pub fn new(pool: Arc<Mutex<AppDatabasePool>>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl AdminRepository for PostgresAdminRepository {
    async fn get_by_id(&self, id: &str) -> Result<Option<Admin>, RepositoryError> {
        let mut conn = self.pool.lock().await.acquire().await?;

        sqlx::query_as!(
            Admin,
            r#"
            SELECT * FROM admins WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&mut *conn)
        .await
        .map_err(|e| RepositoryError::QueryError(e.into()))
    }

    async fn create(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAdmin,
    ) -> Result<Admin, RepositoryError> {
        sqlx::query_as!(
            Admin,
            r#"
            INSERT INTO admins (id)
            VALUES ($1)
            RETURNING *
            "#,
            payload.id,
        )
        .fetch_one(&mut **executor)
        .await
        .map_err(|e| RepositoryError::QueryError(e.into()))
    }
}
