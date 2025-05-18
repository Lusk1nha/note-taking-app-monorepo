use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode, response::IntoResponse};

use crate::{
    common::{axum_response::ValidatedJson, error_response::ErrorResponse},
    domain::{
        auth::auth_dto::{
            LoginWithCredentialsRequest, RegisterWithCredentialsDtoResponse,
            RegisterWithCredentialsRequest,
        },
        user::user_dto::UserDtoResponse,
    },
    errors::request_response_errors::{bad_request_error, internal_server_error},
    services::{auth_service::AuthProvider, service_register::ServiceRegister},
};

pub struct AuthController;

impl AuthController {
    pub async fn login_with_credentials(
        State(services): State<Arc<ServiceRegister>>,
        ValidatedJson(payload): ValidatedJson<LoginWithCredentialsRequest>,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        Ok(())
    }

    pub async fn register_with_credentials(
        State(services): State<Arc<ServiceRegister>>,
        ValidatedJson(payload): ValidatedJson<RegisterWithCredentialsRequest>,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        Self::check_user_exists(&services, &payload.email).await?;

        let (user, _credentials) = services
            .auth_service
            .register(payload)
            .await
            .map_err(|e| internal_server_error(e.to_string()))?;

        let response = RegisterWithCredentialsDtoResponse {
            message: "User registered successfully".to_string(),
            user: UserDtoResponse::from(&user),
        };

        Ok((StatusCode::CREATED, Json(response)))
    }

    async fn check_user_exists(
        services: &ServiceRegister,
        email: &str,
    ) -> Result<(), ErrorResponse> {
        let user_by_email = services
            .credentials_service
            .get_credentials_by_email(&email)
            .await
            .map_err(|e| internal_server_error(e.to_string()))?;

        if user_by_email.is_some() {
            return Err(bad_request_error("Email already exists"));
        }

        Ok(())
    }
}
