use std::sync::Arc;

use axum::{
    body::Body,
    extract::{Request, State},
    http::{HeaderMap, header::AUTHORIZATION},
    middleware::Next,
    response::IntoResponse,
};
use tracing::debug;
use uuid::Uuid;

use crate::{
    common::{error_response::ErrorResponse, roles::Role},
    errors::request_response_errors::{internal_server_error, unauthorized_error},
    services::{jwt_service::JwtServiceTrait, service_register::ServiceRegister},
};

pub async fn auth_middleware(
    State(services): State<Arc<ServiceRegister>>,
    req: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, ErrorResponse> {
    let req = authenticate_user(&services, req).await?;
    let req = authorize_user(&services, req).await?;

    Ok(next.run(req).await)
}

async fn authenticate_user(
    services: &Arc<ServiceRegister>,
    mut req: Request<Body>,
) -> Result<Request<Body>, ErrorResponse> {
    let headers = req.headers();

    let token = extract_bearer_token(headers).ok_or_else(|| {
        debug!("Missing or invalid Authorization header format");
        unauthorized_error("Missing or invalid authentication token")
    })?;

    let claims = services.jwt_service.decode_token(&token).map_err(|e| {
        debug!("JWT decoding failed: {:?}", e);
        unauthorized_error("Invalid authentication token")
    })?;

    let user_id = Uuid::parse_str(&claims.sub).map_err(|e| {
        debug!("Invalid UUID in JWT subject: {:?}", e);
        unauthorized_error("Invalid authentication token")
    })?;

    req.extensions_mut().insert(claims);
    req.extensions_mut().insert(user_id);

    Ok(req)
}

async fn authorize_user(
    services: &Arc<ServiceRegister>,
    mut req: Request<Body>,
) -> Result<Request<Body>, ErrorResponse> {
    let user_id = req.extensions().get::<Uuid>().ok_or_else(|| {
        debug!("User ID not found in request extensions");
        unauthorized_error("User ID not found")
    })?;

    let mut roles: Vec<Role> = Vec::new();

    let user = services
        .user_service
        .get_user_by_id(user_id)
        .await
        .map_err(|e| {
            debug!("Failed to get user by ID: {:?}", e);
            internal_server_error("Failed to retrieve user information") // Mensagem mais precisa
        })?;

    if user.is_some() {
        roles.push(Role::User);
    }

    let admin = services
        .admin_service
        .get_admin_by_id(user_id)
        .await
        .map_err(|e| {
            debug!("Failed to get admin by ID: {:?}", e);
            internal_server_error("Admin not found")
        })?;

    if admin.is_some() {
        roles.push(Role::Admin);
    }

    if roles.is_empty() {
        debug!("User does not have any roles");
        return Err(unauthorized_error(
            "User does not have any roles or is deleted",
        ));
    }

    req.extensions_mut().insert(roles);

    Ok(req)
}

/// Extract the bearer token from the headers
///
/// - The token is expected to be a Bearer token
/// - Returns None if the header is missing, malformed, or not a Bearer token
fn extract_bearer_token(headers: &HeaderMap) -> Option<String> {
    headers.get(AUTHORIZATION).and_then(|value| {
        value.to_str().ok().and_then(|s| {
            let mut parts = s.splitn(2, ' ');
            match (parts.next(), parts.next()) {
                (Some(scheme), Some(token)) if scheme.eq_ignore_ascii_case("Bearer") => {
                    Some(token.trim().to_string())
                }
                _ => None,
            }
        })
    })
}
