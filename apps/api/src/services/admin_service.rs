use async_trait::async_trait;
use sqlx::{Postgres, Transaction};
use uuid::Uuid;

use crate::{
    domain::admin::{
        admin_errors::AdminServiceError,
        admin_model::{Admin, CreateAdmin, CreateAdminDto},
    },
    repositories::admin_repository::AdminRepository,
};

#[async_trait]
pub trait AdminServiceTrait: Send + Sync {
    async fn get_admin_by_id(&self, id: &Uuid) -> Result<Option<Admin>, AdminServiceError>;

    async fn create_admin(
        &self,
        executor: &mut Transaction<'_, Postgres>,
        payload: CreateAdminDto,
    ) -> Result<Admin, AdminServiceError>;
}

#[derive(Clone)]
pub struct AdminService<R: AdminRepository> {
    repository: R,
}

impl<R> AdminService<R>
where
    R: AdminRepository,
{
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[async_trait]
impl<R> AdminServiceTrait for AdminService<R>
where
    R: AdminRepository + Send + Sync,
{
    async fn get_admin_by_id(&self, id: &Uuid) -> Result<Option<Admin>, AdminServiceError> {
        self.repository
            .get_by_id(&id.to_string())
            .await
            .map_err(Into::into)
    }

    async fn create_admin(
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
