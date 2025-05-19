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
        auth_provider::auth_provider_model::{AuthProviderType, CreateAuthProviderDto},
        credentials::credentials_model::CreateCredentialsDto,
        user::user_model::{CreateUserDto, User},
    },
    repositories::{
        auth_provider_repository::AuthProviderRepository,
        credentials_repository::CredentialsRepository, user_repository::UserRepository,
    },
};

use super::{
    auth_provider_service::AuthProviderService,
    credentials_service::CredentialsService,
    jwt_service::{JwtService, JwtServiceTrait},
    user_service::UserService,
};

#[async_trait]
pub trait AuthProvider: Send + Sync {
    async fn register(&self, data: RegisterWithCredentialsRequest) -> Result<User, AuthError>;
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
    jwt_service: Arc<JwtService>,
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
        jwt_service: Arc<JwtService>,
    ) -> Self {
        Self {
            pool,
            user_service,
            credentials_service,
            auth_provider_service,
            jwt_service,
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
    async fn register(&self, data: RegisterWithCredentialsRequest) -> Result<User, AuthError> {
        let pool = self.pool.lock().await;
        let mut tx = pool.begin().await?;

        match self.credentials_service.get_by_email(&data.email).await? {
            Some(_) => return Err(AuthError::UserAlreadyExists),
            None => {}
        };

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

        self.credentials_service
            .create_credentials(
                &mut tx,
                CreateCredentialsDto {
                    user_id: user.id.clone(),
                    email: data.email,
                    password: data.password,
                },
            )
            .await?;

        self.auth_provider_service
            .create_auth_provider(
                &mut tx,
                CreateAuthProviderDto {
                    user_id: user.id.clone(),
                    provider_type: AuthProviderType::Credentials,
                },
            )
            .await?;

        tx.commit().await?;

        Ok(user)
    }

    async fn login(&self, data: LoginWithCredentialsRequest) -> Result<String, AuthError> {
        let credentials = self
            .credentials_service
            .get_by_email(&data.email)
            .await?
            .ok_or(AuthError::InvalidCredentials)?;

        let is_valid = self
            .credentials_service
            .verify_hash_password(&data.password, &credentials.password_hash)
            .map_err(|_| AuthError::InvalidCredentials)?;

        if !is_valid {
            return Err(AuthError::InvalidCredentials);
        }

        self.jwt_service
            .generate_token(&credentials.id)
            .map_err(AuthError::JwtCreationError)
    }

    async fn logout(&self, _token: &str) -> Result<(), AuthError> {
        todo!("Implementação do método logout será adicionada aqui");
    }
}
