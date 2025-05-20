// src/services/service_register.rs

use std::sync::Arc;

use crate::{
    app_state::AppState,
    repositories::{
        admin_repository::PostgresAdminRepository,
        auth_provider_repository::PostgresAuthProviderRepository,
        credentials_repository::PostgresCredentialsRepository,
        user_repository::PostgresUserRepository,
    },
    services::{
        admin_service::AdminService, auth_provider_service::AuthProviderService,
        auth_service::AuthService, credentials_service::CredentialsService,
        jwt_service::JwtService, user_service::UserService,
    },
};

use super::{
    admin_service::AdminServiceTrait, auth_provider_service::AuthProviderServiceTrait, credentials_service::CredentialsServiceTrait, jwt_service::JwtServiceTrait, roles_service::{RoleChecker, UserRoleChecker}, user_service::UserServiceTrait
};

#[derive(Clone)]
pub struct ServiceRegister {
    pub admin_service: Arc<dyn AdminServiceTrait>,
    pub user_service: Arc<dyn UserServiceTrait>,
    pub credentials_service: Arc<dyn CredentialsServiceTrait>,
    pub auth_provider_service: Arc<dyn AuthProviderServiceTrait>,
    pub jwt_service: Arc<dyn JwtServiceTrait + Send + Sync>,
    pub role_checker: Arc<dyn RoleChecker>,
    pub auth_service: Arc<AuthService>,
}

impl ServiceRegister {
    pub fn new(app_state: Arc<AppState>) -> Arc<Self> {
        // 1. Initialize Repositories
        let user_repository = PostgresUserRepository::new(app_state.database.pool.clone());
        let credentials_repository =
            PostgresCredentialsRepository::new(app_state.database.pool.clone());
        let auth_provider_repository =
            PostgresAuthProviderRepository::new(app_state.database.pool.clone());
        let admin_repository = PostgresAdminRepository::new(app_state.database.pool.clone());

        // 2. Initialize Core Services with Trait Objects
        let user_service = Arc::new(UserService::new(user_repository)) as Arc<dyn UserServiceTrait>;
        let admin_service =
            Arc::new(AdminService::new(admin_repository)) as Arc<dyn AdminServiceTrait>;
        let jwt_service = Arc::new(JwtService::new(app_state.environment.jwt_secret.clone()))
            as Arc<dyn JwtServiceTrait + Send + Sync>;

        // 3. Setup Role Checking System
        let role_checker = Arc::new(UserRoleChecker::new(
            user_service.clone(),
            admin_service.clone(),
        )) as Arc<dyn RoleChecker>;

        // 4. Initialize Authentication Services
        let credentials_service = Arc::new(CredentialsService::new(credentials_repository));
        let auth_provider_service = Arc::new(AuthProviderService::new(auth_provider_repository));

        let auth_service = Arc::new(AuthService::new(
            app_state.database.pool.clone(),
            user_service.clone(),
            credentials_service.clone(),
            auth_provider_service.clone(),
            jwt_service.clone(),
        ));

        // 5. Construct Service Register
        Arc::new(Self {
            admin_service,
            user_service,
            credentials_service,
            auth_provider_service,
            jwt_service,
            role_checker,
            auth_service,
        })
    }
}
