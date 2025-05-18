use axum::{Json, http::StatusCode, response::IntoResponse};

use crate::common::error_response::ErrorResponse;

const NOT_FOUND_STATUS: StatusCode = StatusCode::NOT_FOUND;

const ROUTE_NOT_FOUND_MESSAGE: &str =
    "Route not found, for more information check the documentation";
const VERSION_NOT_FOUND_MESSAGE: &str =
    "Version not found, for more information check the documentation";

pub struct NotFoundController;

impl NotFoundController {
    pub async fn not_found_route() -> impl IntoResponse {
        let response = ErrorResponse::new(ROUTE_NOT_FOUND_MESSAGE.to_string(), NOT_FOUND_STATUS);
        (NOT_FOUND_STATUS, Json(response))
    }

    pub async fn version_not_found() -> impl IntoResponse {
        let response = ErrorResponse::new(VERSION_NOT_FOUND_MESSAGE.to_string(), NOT_FOUND_STATUS);
        (NOT_FOUND_STATUS, Json(response))
    }
}
