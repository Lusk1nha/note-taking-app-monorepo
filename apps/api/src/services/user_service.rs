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

#[derive(Clone)]
pub struct UserService<R: UserRepository> {
    repository: R,
}

impl<R: UserRepository> UserService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn get_user_by_id(&self, id: &Uuid) -> Result<Option<User>, UserServiceError> {
        self.repository
            .get_by_id(&id.to_string())
            .await
            .map_err(Into::into)
    }

    pub async fn get_all_users(&self) -> Result<Vec<User>, UserServiceError> {
        self.repository.get_all().await.map_err(Into::into)
    }

    pub async fn create_user(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateUserDto,
    ) -> Result<User, UserServiceError> {
        payload.validate()?;

        let user = CreateUser {
            id: generate_new_uuid_v4().to_string(),
            name: payload.name,
            image: payload.image,
        };

        self.repository
            .create(executor, user)
            .await
            .map_err(Into::into)
    }
}
