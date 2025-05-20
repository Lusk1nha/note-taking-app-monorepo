use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode, response::IntoResponse};

use crate::{
    common::{axum_response::ValidatedJson, error_response::ErrorResponse},
    domain::{
        auth::auth_dto::{
            LoginDtoResponse, LoginWithCredentialsRequest, RegisterWithCredentialsDtoResponse,
            RegisterWithCredentialsRequest,
        },
        user::user_dto::UserDtoResponse,
    },
    errors::request_response_errors::internal_server_error,
    services::{auth_service::AuthServiceTrait, service_register::ServiceRegister},
};

pub struct AuthController;

impl AuthController {
    pub async fn login_with_credentials(
        State(services): State<Arc<ServiceRegister>>,
        ValidatedJson(payload): ValidatedJson<LoginWithCredentialsRequest>,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        let token = services
            .auth_service
            .login(payload)
            .await
            .map_err(|e| internal_server_error(e.to_string()))?;

        let response = LoginDtoResponse {
            access_token: token,
        };

        Ok((StatusCode::OK, Json(response)))
    }

    pub async fn register_with_credentials(
        State(services): State<Arc<ServiceRegister>>,
        ValidatedJson(payload): ValidatedJson<RegisterWithCredentialsRequest>,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        let user = services
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
}
