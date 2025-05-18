use std::sync::Arc;

use async_trait::async_trait;

use crate::{
    domain::{
        auth::{
            auth_dto::{LoginWithCredentialsRequest, RegisterWithCredentialsRequest},
            auth_errors::AuthError,
        },
        credentials::{
            self,
            credentials_model::{CreateCredentialsDto, Credentials},
        },
        user::user_model::{CreateUserDto, User},
    },
    repositories::{
        credentials_repository::CredentialsRepository, user_repository::UserRepository,
    },
};

use super::{credentials_service::CredentialsService, user_service::UserService};

#[async_trait]
pub trait AuthProvider: Send + Sync {
    async fn register(
        &self,
        data: RegisterWithCredentialsRequest,
    ) -> Result<(User, Credentials), AuthError>;
    async fn login(&self, credentials: LoginWithCredentialsRequest) -> Result<String, AuthError>;
    async fn logout(&self, token: &str) -> Result<(), AuthError>;
}

pub struct AuthService<U, C>
where
    U: UserRepository + Send + Sync,
    C: CredentialsRepository + Send + Sync,
{
    user_service: Arc<UserService<U>>,
    credentials_service: Arc<CredentialsService<C>>,
}

impl<U, C> AuthService<U, C>
where
    U: UserRepository + Send + Sync,
    C: CredentialsRepository + Send + Sync,
{
    pub fn new(
        user_service: Arc<UserService<U>>,
        credentials_service: Arc<CredentialsService<C>>,
    ) -> Self {
        Self {
            user_service,
            credentials_service,
        }
    }
}

#[async_trait]
impl<U, C> AuthProvider for AuthService<U, C>
where
    U: UserRepository + Send + Sync,
    C: CredentialsRepository + Send + Sync,
{
    async fn register(
        &self,
        data: RegisterWithCredentialsRequest,
    ) -> Result<(User, Credentials), AuthError> {
        let user = self
            .user_service
            .create_user(CreateUserDto {
                name: None,
                image: None,
            })
            .await?;

        let credentials = self
            .credentials_service
            .create_credentials(CreateCredentialsDto {
                user_id: user.id.clone(),
                email: data.email,
                password: data.password,
            })
            .await?;

        Ok((user, credentials))
    }

    async fn login(&self, credentials: LoginWithCredentialsRequest) -> Result<String, AuthError> {
        todo!("Implementação do método login será adicionada aqui");
    }

    async fn logout(&self, _token: &str) -> Result<(), AuthError> {
        todo!("Implementação do método logout será adicionada aqui");
    }
}
