use sqlx::{Postgres, Transaction};
use uuid::Uuid;

use crate::{
    domain::admin::{
        admin_errors::AdminServiceError,
        admin_model::{Admin, CreateAdmin, CreateAdminDto},
    },
    repositories::admin_repository::AdminRepository,
};

#[derive(Clone)]
pub struct AdminService<R: AdminRepository> {
    repository: R,
}

impl<R: AdminRepository> AdminService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn get_admin_by_id(&self, id: &Uuid) -> Result<Option<Admin>, AdminServiceError> {
        self.repository
            .get_by_id(&id.to_string())
            .await
            .map_err(Into::into)
    }

    pub async fn create_admin(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAdminDto,
    ) -> Result<Admin, AdminServiceError> {
        payload.validate()?;

        let create_admin = CreateAdmin {
            id: payload.id.to_string(),
        };

        self.repository
            .create(executor, create_admin)
            .await
            .map_err(Into::into)
    }
}
