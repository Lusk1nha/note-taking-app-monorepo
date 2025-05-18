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

    pub async fn get_user_by_id(&self, id: &str) -> Result<Option<User>, UserServiceError> {
        self.repository.get_by_id(id).await.map_err(Into::into)
    }

    pub async fn create_user(&self, payload: CreateUserDto) -> Result<User, UserServiceError> {
        payload.validate()?;

        let user = CreateUser {
            id: generate_new_uuid_v4().to_string(),
            name: payload.name,
            image: payload.image,
        };

        self.repository.create(user).await.map_err(Into::into)
    }
}
