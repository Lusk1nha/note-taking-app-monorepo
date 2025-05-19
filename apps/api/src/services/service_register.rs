use std::sync::Arc;

use crate::{
    app_state::AppState,
    repositories::{
        auth_provider_repository::PostgresAuthProviderRepository,
        credentials_repository::PostgresCredentialsRepository,
        user_repository::PostgresUserRepository,
    },
};

use super::{
    auth_provider_service::AuthProviderService, auth_service::AuthService,
    credentials_service::CredentialsService, jwt_service::JwtService, user_service::UserService,
};

pub struct ServiceRegister {
    pub user_service: Arc<UserService<PostgresUserRepository>>,
    pub credentials_service: Arc<CredentialsService<PostgresCredentialsRepository>>,
    pub auth_provider_service: Arc<AuthProviderService<PostgresAuthProviderRepository>>,

    pub auth_service: Arc<
        AuthService<
            PostgresUserRepository,
            PostgresCredentialsRepository,
            PostgresAuthProviderRepository,
        >,
    >,
}

impl ServiceRegister {
    pub fn new(app_state: Arc<AppState>) -> Arc<Self> {
        // Inicialização dos repositórios
        let user_repository = PostgresUserRepository::new(app_state.database.pool.clone());
        let credentials_repository =
            PostgresCredentialsRepository::new(app_state.database.pool.clone());
        let auth_provider_repository =
            PostgresAuthProviderRepository::new(app_state.database.pool.clone());

        // Inicialização dos serviços
        let user_service = Arc::new(UserService::new(user_repository));
        let credentials_service = Arc::new(CredentialsService::new(credentials_repository));
        let auth_provider_service = Arc::new(AuthProviderService::new(auth_provider_repository));
        let jwt_service = Arc::new(JwtService::new(app_state.environment.jwt_secret.clone()));

        let auth_service = Arc::new(AuthService::new(
            app_state.database.pool.clone(),
            user_service.clone(),
            credentials_service.clone(),
            auth_provider_service.clone(),
            jwt_service.clone(),
        ));

        Arc::new(Self {
            user_service,
            credentials_service,
            auth_provider_service,
            auth_service,
        })
    }
}
