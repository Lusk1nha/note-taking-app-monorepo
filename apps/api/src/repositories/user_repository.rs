use async_trait::async_trait;

use std::sync::Arc;
use tokio::sync::Mutex;

use crate::{
    database::AppDatabasePool,
    domain::user::user_model::{CreateUser, User},
    errors::sqlx_repository_errors::RepositoryError,
};

#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn get_by_id(&self, id: &str) -> Result<Option<User>, RepositoryError>;
    async fn create(&self, payload: CreateUser) -> Result<User, RepositoryError>;
}

#[derive(Debug, Clone)]
pub struct PostgresUserRepository {
    pool: Arc<Mutex<AppDatabasePool>>,
}

impl PostgresUserRepository {
    pub fn new(pool: Arc<Mutex<AppDatabasePool>>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl UserRepository for PostgresUserRepository {
    async fn get_by_id(&self, id: &str) -> Result<Option<User>, RepositoryError> {
        let mut conn = self.pool.lock().await.acquire().await?;

        sqlx::query_as!(
            User,
            r#"
            SELECT * FROM users WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&mut *conn)
        .await
        .map_err(|e| RepositoryError::QueryError(e.into()))
    }

    async fn create(&self, payload: CreateUser) -> Result<User, RepositoryError> {
        let mut conn = self.pool.lock().await.acquire().await?;

        sqlx::query_as!(
            User,
            r#"
            INSERT INTO users (id, name, image)
            VALUES ($1, $2, $3)
            RETURNING *
            "#,
            payload.id,
            payload.name,
            payload.image
        )
        .fetch_one(&mut *conn)
        .await
        .map_err(|e| RepositoryError::QueryError(e.into()))
    }
}
