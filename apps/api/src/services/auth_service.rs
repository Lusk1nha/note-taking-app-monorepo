use std::sync::Arc;

use async_trait::async_trait;
use tokio::sync::Mutex;

use crate::{
    database::AppDatabasePool,
    domain::{
        auth::{
            auth_dto::{LoginWithCredentialsRequest, RegisterWithCredentialsRequest},
            auth_errors::AuthError,
        },
        auth_provider::auth_provider_model::{
            AuthProvider as AuthProviderModel, AuthProviderType, CreateAuthProviderDto,
        },
        credentials::credentials_model::{CreateCredentialsDto, Credentials},
        user::user_model::{CreateUserDto, User},
    },
    repositories::{
        auth_provider_repository::AuthProviderRepository,
        credentials_repository::CredentialsRepository, user_repository::UserRepository,
    },
};

use super::{
    auth_provider_service::AuthProviderService, credentials_service::CredentialsService,
    user_service::UserService,
};

#[async_trait]
pub trait AuthProvider: Send + Sync {
    async fn register(
        &self,
        data: RegisterWithCredentialsRequest,
    ) -> Result<(User, Credentials, AuthProviderModel), AuthError>;
    async fn login(&self, credentials: LoginWithCredentialsRequest) -> Result<String, AuthError>;
    async fn logout(&self, token: &str) -> Result<(), AuthError>;
}

pub struct AuthService<U, C, A>
where
    U: UserRepository + Send + Sync,
    C: CredentialsRepository + Send + Sync,
    A: AuthProviderRepository + Send + Sync,
{
    pool: Arc<Mutex<AppDatabasePool>>,
    user_service: Arc<UserService<U>>,
    credentials_service: Arc<CredentialsService<C>>,
    auth_provider_service: Arc<AuthProviderService<A>>,
}

impl<U, C, A> AuthService<U, C, A>
where
    U: UserRepository + Send + Sync,
    C: CredentialsRepository + Send + Sync,
    A: AuthProviderRepository + Send + Sync,
{
    pub fn new(
        pool: Arc<Mutex<AppDatabasePool>>,
        user_service: Arc<UserService<U>>,
        credentials_service: Arc<CredentialsService<C>>,
        auth_provider_service: Arc<AuthProviderService<A>>,
    ) -> Self {
        Self {
            pool,
            user_service,
            credentials_service,
            auth_provider_service,
        }
    }
}

#[async_trait]
impl<U, C, A> AuthProvider for AuthService<U, C, A>
where
    U: UserRepository + Send + Sync,
    C: CredentialsRepository + Send + Sync,
    A: AuthProviderRepository + Send + Sync,
{
    async fn register(
        &self,
        data: RegisterWithCredentialsRequest,
    ) -> Result<(User, Credentials, AuthProviderModel), AuthError> {
        let mut tx = self.pool.lock().await.begin().await?;

        let user = self
            .user_service
            .create_user(
                &mut tx,
                CreateUserDto {
                    name: None,
                    image: None,
                },
            )
            .await?;

        let credentials = self
            .credentials_service
            .create_credentials(
                &mut tx,
                CreateCredentialsDto {
                    user_id: user.id.clone(),
                    email: data.email,
                    password: data.password,
                },
            )
            .await?;

        let auth_provider = self
            .auth_provider_service
            .create_auth_provider(
                &mut tx,
                CreateAuthProviderDto {
                    user_id: user.id.clone(),
                    provider_type: AuthProviderType::Credentials,
                },
            )
            .await?;

        tx.commit().await?;

        Ok((user, credentials, auth_provider))
    }

    async fn login(&self, credentials: LoginWithCredentialsRequest) -> Result<String, AuthError> {
        todo!("Implementação do método login será adicionada aqui");
    }

    async fn logout(&self, _token: &str) -> Result<(), AuthError> {
        todo!("Implementação do método logout será adicionada aqui");
    }
}
