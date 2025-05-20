use std::sync::Arc;

use async_trait::async_trait;
use uuid::Uuid;

use crate::{common::roles::Role, domain::auth::auth_errors::AuthError};

use super::{admin_service::AdminServiceTrait, user_service::UserServiceTrait};

#[async_trait]
pub trait RoleChecker: Send + Sync {
    async fn get_roles(&self, user_id: Uuid) -> Result<Vec<Role>, AuthError>;
}

pub struct UserRoleChecker {
    user_service: Arc<dyn UserServiceTrait>,
    admin_service: Arc<dyn AdminServiceTrait>,
}

impl UserRoleChecker {
    pub fn new(
        user_service: Arc<dyn UserServiceTrait>,
        admin_service: Arc<dyn AdminServiceTrait>,
    ) -> Self {
        Self {
            user_service,
            admin_service,
        }
    }
}

#[async_trait]
impl RoleChecker for UserRoleChecker {
    async fn get_roles(&self, user_id: Uuid) -> Result<Vec<Role>, AuthError> {
        let (user, admin) = tokio::join!(
            self.user_service.get_user_by_id(&user_id),
            self.admin_service.get_admin_by_id(&user_id)
        );

        let mut roles = Vec::new();
        if user?.is_some() {
            roles.push(Role::User)
        }
        if admin?.is_some() {
            roles.push(Role::Admin)
        }

        Ok(roles)
    }
}
