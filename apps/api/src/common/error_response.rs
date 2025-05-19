use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};

use serde::Serialize;

use crate::domain::auth::auth_errors::AuthError;

#[derive(Serialize, Debug)]
pub struct ErrorResponse {
    pub message: String,
    #[serde(serialize_with = "status_code_to_u16", rename = "statusCode")]
    pub status_code: StatusCode,
}

fn status_code_to_u16<S>(status_code: &StatusCode, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    serializer.serialize_u16(status_code.as_u16())
}

impl ErrorResponse {
    pub fn new(message: String, status_code: StatusCode) -> Self {
        Self {
            message,
            status_code,
        }
    }
}

impl IntoResponse for ErrorResponse {
    fn into_response(self) -> Response {
        (self.status_code, Json(self)).into_response()
    }
}

pub trait IntoHttpError {
    fn into_http_error(self) -> (StatusCode, String);
}

impl IntoHttpError for AuthError {
    fn into_http_error(self) -> (StatusCode, String) {
        match self {
            AuthError::UserAlreadyExists => (StatusCode::CONFLICT, self.to_string()),
            AuthError::InvalidCredentials => (StatusCode::UNAUTHORIZED, self.to_string()),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()),
        }
    }
}
