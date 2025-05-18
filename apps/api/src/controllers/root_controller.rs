use axum::{Json, http::StatusCode, response::IntoResponse};
use once_cell::sync::Lazy;
use serde::Serialize;

use crate::common::error_response::ErrorResponse;

static AUTHORS: Lazy<Vec<String>> =
    Lazy::new(|| vec!["Lucas Pedro da Hora <https://github.com/Lusk1nha>".to_string()]);

#[derive(Debug, Serialize)]
pub struct JsonRootResponse {
    pub title: String,
    pub description: String,
    pub authors: Vec<String>,
}

pub struct RootController;

impl RootController {
    pub async fn index() -> Result<impl IntoResponse, ErrorResponse> {
        let response = JsonRootResponse {
            title: "API to manage your notes".to_string(),
            description: "This is a simple API to manage notes".to_string(),
            authors: AUTHORS.clone(),
        };

        Ok((StatusCode::OK, Json(response)))
    }
}
