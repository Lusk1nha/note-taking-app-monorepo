use chrono::{DateTime, Utc};
use serde::Serialize;

use super::user_model::User;

#[derive(Serialize)]
pub struct UserDtoResponse {
    pub id: String,

    pub name: Option<String>,
    pub image: Option<String>,

    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,

    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
}

impl From<&User> for UserDtoResponse {
    fn from(user: &User) -> Self {
        Self {
            id: user.id.clone(),
            name: user.name.clone(),
            image: user.image.clone(),
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}
