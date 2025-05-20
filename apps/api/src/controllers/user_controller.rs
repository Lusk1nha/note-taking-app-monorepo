use std::sync::Arc;

use axum::{
    Extension, Json,
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use uuid::Uuid;

use crate::{
    common::error_response::ErrorResponse, domain::user::user_dto::UserDtoResponse,
    errors::request_response_errors::internal_server_error,
    services::service_register::ServiceRegister,
};

pub struct UserController;

impl UserController {
    pub async fn get_current_user(
        State(services): State<Arc<ServiceRegister>>,
        Extension(user_id): Extension<Uuid>,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        let user = services
            .user_service
            .get_user_by_id(&user_id)
            .await
            .map_err(|e| internal_server_error(e.to_string()))
            .and_then(|user| {
                user.ok_or_else(|| internal_server_error("User not found".to_string()))
            })?;

        let response = UserDtoResponse::from(&user);

        Ok((StatusCode::OK, Json(response)))
    }

    pub async fn get_user_by_id(
        State(services): State<Arc<ServiceRegister>>,
        Path(user_id): Path<uuid::Uuid>,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        let user = services
            .user_service
            .get_user_by_id(&user_id)
            .await
            .map_err(|e| internal_server_error(e.to_string()))
            .and_then(|user| {
                user.ok_or_else(|| internal_server_error("User not found".to_string()))
            })?;

        let response = UserDtoResponse::from(&user);

        Ok((StatusCode::OK, Json(response)))
    }

    pub async fn get_users(
        State(services): State<Arc<ServiceRegister>>,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        let users = services
            .user_service
            .get_all_users()
            .await
            .map_err(|e| internal_server_error(e.to_string()))?;

        let response = users.iter().map(UserDtoResponse::from).collect::<Vec<_>>();

        Ok((StatusCode::OK, Json(response)))
    }
}
