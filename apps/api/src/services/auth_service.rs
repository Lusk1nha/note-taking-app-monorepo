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
    services::{
        auth_provider_service::AuthProviderServiceTrait,
        credentials_service::CredentialsServiceTrait, jwt_service::JwtServiceTrait,
        user_service::UserServiceTrait,
    },
};

#[async_trait]
pub trait AuthServiceTrait: Send + Sync {
    async fn register(&self, data: RegisterWithCredentialsRequest) -> Result<User, AuthError>;
    async fn login(&self, credentials: LoginWithCredentialsRequest) -> Result<String, AuthError>;
    async fn logout(&self, token: &str) -> Result<(), AuthError>;
}

pub struct AuthService {
    pool: Arc<Mutex<AppDatabasePool>>,
    user_service: Arc<dyn UserServiceTrait>,
    credentials_service: Arc<dyn CredentialsServiceTrait>,
    auth_provider_service: Arc<dyn AuthProviderServiceTrait>,
    jwt_service: Arc<dyn JwtServiceTrait + Send + Sync>,
}

impl AuthService {
    pub fn new(
        pool: Arc<Mutex<AppDatabasePool>>,
        user_service: Arc<dyn UserServiceTrait>,
        credentials_service: Arc<dyn CredentialsServiceTrait>,
        auth_provider_service: Arc<dyn AuthProviderServiceTrait>,
        jwt_service: Arc<dyn JwtServiceTrait + Send + Sync>,
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
impl AuthServiceTrait for AuthService {
    async fn register(&self, data: RegisterWithCredentialsRequest) -> Result<User, AuthError> {
        let mut tx = self.pool.lock().await.begin().await?;

        if self.credentials_service.email_exists(&data.email).await? {
            return Err(AuthError::UserAlreadyExists);
        }

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

        self.credentials_service
            .verify_password(&data.password, &credentials.password_hash)
            .await
            .map_err(|_| AuthError::InvalidCredentials)?;

        self.jwt_service
            .generate_token(&credentials.id)
            .map_err(Into::into)
    }

    async fn logout(&self, token: &str) -> Result<(), AuthError> {
        Ok(())
    }
}
