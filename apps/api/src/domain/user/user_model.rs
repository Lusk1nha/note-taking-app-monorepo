use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::prelude::FromRow;

use super::user_errors::UserServiceError;

#[derive(FromRow, Serialize)]
pub struct User {
    pub id: String,
    pub name: Option<String>,
    pub image: Option<String>,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct CreateUserDto {
    pub name: Option<String>,
    pub image: Option<String>,
}

impl CreateUserDto {
    pub fn validate(&self) -> Result<(), UserServiceError> {
        Ok(())
    }
}

pub struct CreateUser {
    pub id: String,
    pub name: Option<String>,
    pub image: Option<String>,
}

pub struct UpdateUser {
    pub id: String,
    pub name: Option<String>,
    pub image: Option<String>,
}
