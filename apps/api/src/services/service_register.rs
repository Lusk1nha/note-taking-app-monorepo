use std::sync::Arc;

use crate::{
    app_state::AppState,
    repositories::{
        credentials_repository::PostgresCredentialsRepository,
        user_repository::PostgresUserRepository,
    },
};

use super::{
    auth_service::AuthService, credentials_service::CredentialsService, user_service::UserService,
};

pub struct ServiceRegister {
    pub user_service: Arc<UserService<PostgresUserRepository>>,
    pub credentials_service: Arc<CredentialsService<PostgresCredentialsRepository>>,

    pub auth_service: Arc<AuthService<PostgresUserRepository, PostgresCredentialsRepository>>,
}

impl ServiceRegister {
    pub fn new(app_state: Arc<AppState>) -> Arc<Self> {
        // Inicialização dos repositórios
        let user_repository = PostgresUserRepository::new(app_state.database.pool.clone());
        let credentials_repository =
            PostgresCredentialsRepository::new(app_state.database.pool.clone());

        // Inicialização dos serviços
        let user_service = Arc::new(UserService::new(user_repository));
        let credentials_service = Arc::new(CredentialsService::new(credentials_repository));

        let auth_service = Arc::new(AuthService::new(
            user_service.clone(),
            credentials_service.clone(),
        ));

        Arc::new(Self {
            user_service,
            credentials_service,
            auth_service,
        })
    }
}
