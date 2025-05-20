use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::prelude::FromRow;
use uuid::Uuid;

use super::admin_errors::AdminServiceError;

#[derive(FromRow, Serialize)]
pub struct Admin {
    pub id: String,
    pub created_at: DateTime<Utc>,
}

pub struct CreateAdmin {
    pub id: String,
}

pub struct CreateAdminDto {
    pub id: Uuid,
}

impl CreateAdminDto {
    pub fn validate(&self) -> Result<(), AdminServiceError> {
        Ok(())
    }
}
