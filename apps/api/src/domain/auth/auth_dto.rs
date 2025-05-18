use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::domain::user::user_dto::UserDtoResponse;

#[derive(Deserialize, Validate)]
pub struct LoginWithCredentialsRequest {
    #[validate(
        email(message = "Email is invalid"),
        length(min = 1, message = "Email is required")
    )]
    pub email: String,

    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginDtoResponse {
    #[serde(rename = "accessToken")]
    pub access_token: String,
}

#[derive(Deserialize, Validate, Debug)]
pub struct RegisterWithCredentialsRequest {
    #[validate(
        email(message = "Email is invalid"),
        length(min = 1, message = "Email is required")
    )]
    pub email: String,

    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    pub password: String,
}

#[derive(Serialize)]
pub struct RegisterWithCredentialsDtoResponse {
    pub message: String,
    pub user: UserDtoResponse,
}
