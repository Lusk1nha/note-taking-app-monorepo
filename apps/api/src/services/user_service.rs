use async_trait::async_trait;
use sqlx::{Postgres, Transaction};
use uuid::Uuid;

use crate::{
    domain::user::{
        user_errors::UserServiceError,
        user_model::{CreateUser, CreateUserDto, User},
    },
    helpers::uuid::generate_new_uuid_v4,
    repositories::user_repository::UserRepository,
};

#[async_trait]
pub trait UserServiceTrait: Send + Sync {
    async fn get_user_by_id(&self, id: &Uuid) -> Result<Option<User>, UserServiceError>;

    async fn get_all_users(&self) -> Result<Vec<User>, UserServiceError>;

    async fn create_user(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateUserDto,
    ) -> Result<User, UserServiceError>;
}

#[derive(Clone)]
pub struct UserService<R: UserRepository> {
    repository: R,
}

impl<R> UserService<R>
where
    R: UserRepository,
{
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[async_trait]
impl<R> UserServiceTrait for UserService<R>
where
    R: UserRepository + Send + Sync,
{
    async fn get_user_by_id(&self, id: &Uuid) -> Result<Option<User>, UserServiceError> {
        self.repository
            .get_by_id(&id.to_string())
            .await
            .map_err(Into::into)
    }

    async fn get_all_users(&self) -> Result<Vec<User>, UserServiceError> {
        self.repository.get_all().await.map_err(Into::into)
    }

    async fn create_user(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateUserDto,
    ) -> Result<User, UserServiceError> {
        payload.validate()?;

        let create_user = CreateUser {
            id: generate_new_uuid_v4().to_string(),
            image: payload.image,
            name: payload.name,
        };

        self.repository
            .create(executor, create_user)
            .await
            .map_err(Into::into)
    }
}
