use axum::{Json, http::StatusCode, response::IntoResponse};
use serde::Serialize;

use crate::common::error_response::ErrorResponse;

#[derive(Debug, Serialize)]
pub struct JsonHealthResponse {
    pub status: String,
}

pub struct HealthController;

impl HealthController {
    pub async fn health_check() -> Result<impl IntoResponse, ErrorResponse> {
        let response = JsonHealthResponse {
            status: "OK".to_string(),
        };

        Ok((StatusCode::OK, Json(response)))
    }
}
